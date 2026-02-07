"""
Statistics Canada CSV to JSON Processor.

========================================

Processes Statistics Canada grocery price data and outputs JSON for web
deployment.

Usage:
    python process_statscan_to_json.py input.csv output.json

Example:
    python process_statscan_to_json.py data/statscan-full.csv \\
        public/data/grocery-data.json
"""

import json
import re
import sys
from pathlib import Path
from typing import Dict, List, Tuple

import pandas as pd


class StatCanJSONProcessor:
    """Process Statistics Canada grocery price data to JSON format.

    This processor transforms raw StatCan CSV data into a structured JSON
    format suitable for web deployment. It handles:
    - Product name cleaning and normalization
    - Weight/unit extraction from both package sizes and per-unit pricing
    - Category inference based on product keywords
    - Price normalization (per-unit pricing)
    - Location parsing

    The key logic:
    - Products with "per kilogram" in description: price is already per kg
    - Products with "500 grams" in description: package price / 0.5 = per kg
    """

    # Regex patterns for data extraction
    PER_UNIT_EXPR = (
        r"per\s+(kilogram|kg|gram|g|litre|l|ml|millilitre)s?\b"
    )
    PACKAGE_SIZE_EXPR = (
        r"\b(\d+(\.\d+)?)\s*"
        r"(kg|kilogram(s)?|g|gram(s)?|l|litre(s)?|ml|millilitre(s)?)\b"
    )
    PER_EXPR = r",?\s*per\b.*$"
    QUANTITY_EXPR = r"\b\d+\s*(dozen|bags?|packs?|items?)\b"
    UNIT_GARBAGE = (
        r"\b(kilo)?gram(s)?\b|"
        r"\b(litre|litres|liter|liters)\b|"
        r"\bunit\b"
    )

    # Category keywords for classification
    # Note: Order matters - more specific categories should come first
    CATEGORY_KEYWORDS = {
        "vegetable": [
            "potato", "sweet potato", "tomato", "carrot", "onion",
            "celery", "cucumber", "iceberg lettuce", "romaine lettuce",
            "broccoli", "bell pepper", "lemon", "lime", "avocado",
            "cabbage", "mushroom", "squash", "green salad",
        ],
        "fruit": [
            "cantaloupe", "apple", "orange", "banana", "pear",
            "grape", "strawberry",
        ],
        "dairy_and_egg": [
            "cow milk", "soy milk", "nut milk", "whole cream", "butter",
            "block cheese", "yogurt", "egg",
        ],
        "pork": ["pork loin", "pork", "bacon"],
        "beef": [
            "beef stewing", "beef striploin", "beef top sirloin",
            "beef rib", "ground beef", "beef",
        ],
        "poultry": [
            "whole chicken", "chicken breast", "chicken thigh",
            "chicken drumsticks", "chicken",
        ],
        "plant_based_protein": ["tofu"],
        "carbs": [
            "dry pasta", "fresh pasta", "pasta", "brown rice", "white rice",
            "white bread", "flatbread", "pita", "crackers", "crisp bread",
        ],
        "seafood": ["salmon", "shrimp", "tuna"],
        "nuts_and_dry_beans": [
            "peanut", "almond", "sunflower seed", "dried lentils",
            "dry bean", "legume", "bean",
        ],
        "seasoning": ["ketchup", "mayonnaise", "salad dressing", "white sugar", "brown sugar"],
        "baby_items": ["baby food", "infant formula"],
        "frozen_food": [
            "frozen french fries", "frozen broccoli", "frozen green bean",
            "frozen corn", "frozen mixed vegetable", "frozen pea",
            "frozen pizza", "frozen spinach", "frozen strawberry",
        ],
        "deli": ["wiener", "meatless burger", "hummus", "salsa"],
        "canned_food": [
            "canned tomato", "canned baked bean", "canned soup",
            "canned bean", "canned lentil", "canned corn",
            "canned peach", "canned pear", "canned salmon", "canned tuna",
        ],
        "snacks": ["cookie", "cookies", "sweet biscuit", "biscuit"],
        "baking_ingredients": ["wheat flour", "wheet flour", "flour"],
        "personal_care": ["deodorant", "toothpaste", "tooth paste", "shampoo", "conditioner"],
        "household_supply": ["laundry detergent"],
        "drink": ["apple juice", "roasted coffee", "ground coffee", "coffee", "tea"],
        "pantry_item": ["peanut butter", "pasta sauce", "cereal"],
        "oil": ["margarine", "vegetable oil", "canola oil", "olive oil"],
    }

    def __init__(self) -> None:
        """Initialize the processor with regex patterns."""
        self.per_unit_regex = re.compile(
            self.PER_UNIT_EXPR, re.IGNORECASE
        )
        self.package_size_regex = re.compile(
            self.PACKAGE_SIZE_EXPR, re.IGNORECASE
        )
        self.clean_regex = re.compile(
            (
                f"({self.PACKAGE_SIZE_EXPR})|"
                f"({self.QUANTITY_EXPR})|"
                f"({self.UNIT_GARBAGE})"
            ),
            re.IGNORECASE,
        )

    def process(self, input_file: str, output_file: str) -> None:
        """Process CSV file and output JSON.

        Args:
            input_file: Path to input CSV file
            output_file: Path to output JSON file

        Raises:
            FileNotFoundError: If input file doesn't exist
            pd.errors.EmptyDataError: If CSV is empty
        """
        print(f"Reading data from {input_file}...")
        df = pd.read_csv(input_file, low_memory=False)
        print(f"Loaded {len(df)} rows")

        print("\nTransforming data...")
        df_transformed = self.transform(df)

        # Convert to JSON-friendly format
        print("\nConverting to JSON format...")
        output_data = self.create_json_structure(df_transformed)

        # Write to JSON file
        print(f"\nWriting results to {output_file}...")
        output_path = Path(output_file)
        output_path.parent.mkdir(parents=True, exist_ok=True)

        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(output_data, f, indent=2, ensure_ascii=False)

        print(f"Done! Processed {len(df_transformed)} rows")

        # Print summary
        self.print_summary(df_transformed, output_data)

    def transform(self, df: pd.DataFrame) -> pd.DataFrame:
        """Transform raw CSV data into clean, structured format.

        Applies cleaning operations in the following order:
        1. Rename columns to standardized names
        2. Format dates to YYYY-MM-DD format
        3. Detect per-unit pricing vs package pricing
        4. Extract weight/unit from per-unit or package descriptions
        5. Clean product names
        6. Infer product categories
        7. Normalize prices (divide package price by weight when needed)
        8. Format location strings
        9. Parse locations into city and province
        10. Filter out invalid prices

        Args:
            df: Raw DataFrame from CSV extraction

        Returns:
            Transformed DataFrame with cleaned and normalized data
        """
        # Rename columns to standardized names
        df = df.rename(
            columns={
                "REF_DATE": "date",
                "GEO": "location",
                "Products": "product_raw",
                "VALUE": "product_price",
            }
        )

        # Format dates (YYYY-MM to YYYY-MM-01 for consistency)
        df["date"] = df["date"].apply(self._format_date)

        # Detect if price is already per-unit (contains "per X")
        # Note: Using str.contains without capturing groups to avoid warning
        df["is_per_unit"] = df["product_raw"].str.contains(
            self.PER_UNIT_EXPR, regex=True, case=False, na=False
        )

        # Extract weight and unit
        df[["product_weight", "product_unit"]] = df[
            "product_raw"
        ].apply(lambda x: pd.Series(self._extract_weight_and_unit(x)))

        # Clean product names
        df["product_name"] = df["product_raw"].apply(
            self._clean_product_name
        )

        # Infer categories
        df["product_category"] = df["product_name"].apply(
            self._infer_category
        )

        # Normalize prices
        # If "per X" is in description, price is already per unit
        # Otherwise, divide by weight (e.g., "500 grams" → divide by 0.5)
        df["price_per_unit"] = df.apply(
            lambda row: (
                row["product_price"]
                if row["is_per_unit"]
                else (
                    row["product_price"] / row["product_weight"]
                    if row["product_weight"] > 0
                    else row["product_price"]
                )
            ),
            axis=1,
        ).round(2)

        # Normalize locations
        df["location"] = df["location"].str.strip().str.title()

        # Parse location into city and province
        df[["city", "province"]] = df["location"].apply(
            lambda x: pd.Series(self._parse_location(x))
        )

        # Remove rows with invalid prices (zero or negative)
        df = df[df["price_per_unit"] > 0]

        return df

    def create_json_structure(self, df: pd.DataFrame) -> Dict:
        """Create a structured JSON output with metadata and data.

        Returns:
            Dictionary with metadata, categories, locations, products,
            and price data
        """
        # Get unique products with their info
        products = df[
            ["product_name", "product_category", "product_unit"]
        ].drop_duplicates()
        products_list = products.to_dict("records")

        # Get unique locations
        locations = df[["location", "city", "province"]].drop_duplicates()
        locations_list = locations.to_dict("records")

        # Get unique categories with counts
        category_counts = df["product_category"].value_counts().to_dict()
        categories = [
            {"name": cat, "count": count}
            for cat, count in category_counts.items()
        ]

        # Price records (main data)
        price_records = df[
            [
                "date",
                "product_name",
                "product_category",
                "price_per_unit",
                "product_unit",
                "location",
                "city",
                "province",
            ]
        ].to_dict("records")

        # Date range
        date_range = {
            "min": df["date"].min(),
            "max": df["date"].max(),
        }

        return {
            "metadata": {
                "source": "Statistics Canada",
                "processed_date": pd.Timestamp.now().strftime("%Y-%m-%d"),
                "total_records": len(price_records),
                "date_range": date_range,
                "total_products": len(products_list),
                "total_locations": len(locations_list),
                "total_categories": len(categories),
            },
            "categories": categories,
            "locations": locations_list,
            "products": products_list,
            "prices": price_records,
        }

    def _format_date(self, date_str: str) -> str:
        """Format date string to YYYY-MM-DD.

        Converts "YYYY-MM" format to "YYYY-MM-01".
        If date is already in full format or invalid, returns as-is.

        Args:
            date_str: Date string from CSV (typically YYYY-MM format)

        Returns:
            Formatted date string (YYYY-MM-DD)
        """
        date_str = str(date_str).strip()
        if re.match(r"^\d{4}-\d{2}$", date_str):
            return f"{date_str}-01"
        return date_str

    def _extract_weight_and_unit(self, text: str) -> Tuple[float, str]:
        """Extract weight value and unit from product description.

        Handles two cases:
        1. "per kilogram" → weight=1.0, unit="kg" (already per-unit)
        2. "500 grams" → weight=0.5, unit="kg" (package size)

        Normalizes all weights to standard units (kg, L).

        Args:
            text: Product description text to parse

        Returns:
            Tuple of (weight_value, unit) where unit is kg, L, or unit
        """
        # Check if "per X" pricing (already per-unit)
        per_match = self.per_unit_regex.search(text)
        if per_match:
            unit_text = per_match.group(1).lower()
            # Extract the base unit
            if unit_text in ("kilogram", "kg"):
                return 1.0, "kg"
            elif unit_text in ("gram", "g"):
                return 1.0, "kg"  # Per gram pricing, rare but possible
            elif unit_text in ("litre", "l"):
                return 1.0, "L"
            elif unit_text in ("ml", "millilitre"):
                return 1.0, "L"  # Per ml pricing, rare but possible
            else:
                return 1.0, "kg"

        # Check for package size (e.g., "500 grams", "1 kilogram")
        package_match = self.package_size_regex.search(text)
        if package_match:
            value = float(package_match.group(1))
            unit = package_match.group(3).lower()

            # Convert grams to kg
            if unit == "g" or (
                unit.startswith("gram") and not unit.startswith("kilogram")
            ):
                return value / 1000, "kg"
            # Convert ml to L
            if "ml" in unit or unit.startswith("millilitre"):
                return value / 1000, "L"
            if unit == "l" or unit.startswith("litre"):
                return value, "L"
            # kg or kilogram
            return value, "kg"

        # No weight/unit found, treat as single unit (each)
        return 1.0, "unit"

    def _clean_product_name(self, text: str) -> str:
        """Clean product name by removing weights, units, and extra text.

        Removes:
        - Weight and unit information
        - "per X" phrases
        - Quantity phrases (dozen, bags, packs)
        - Parenthetical content
        - Special characters
        - Extra whitespace

        Args:
            text: Raw product name with extraneous information

        Returns:
            Cleaned product name in title case
        """
        # Remove "per X" phrases
        text = re.sub(self.PER_EXPR, "", text, flags=re.IGNORECASE)

        # Remove weights, quantities, units
        text = self.clean_regex.sub("", text)

        # Remove parentheses and contents
        text = re.sub(r"\(.*?\)", "", text)

        # Remove special characters except spaces
        text = re.sub(r"[^\w\s]", "", text)

        # Normalize whitespace
        text = re.sub(r"\s{2,}", " ", text)

        return text.strip().title()

    def _infer_category(self, name: str) -> str:
        """Infer product category from product name using word-boundary matching.

        Performs keyword matching against category keywords. Returns the first matching
        category or "other" if no keyword matches.
        """
        name_lower = name.lower()

        for category, keywords in self.CATEGORY_KEYWORDS.items():
            for keyword in keywords:
                pattern = rf"\b{re.escape(keyword)}\b"
                if re.search(pattern, name_lower):
                    return category

        return "other"

    def _parse_location(self, location: str) -> Tuple[str, str]:
        """Parse location into city and province.

        Handles formats like:
        - "Canada" → ("", "Canada")
        - "Toronto, Ontario" → ("Toronto", "Ontario")

        Args:
            location: Location string to parse

        Returns:
            Tuple of (city, province)
        """
        parts = [p.strip() for p in location.split(",")]

        if len(parts) >= 2:
            return parts[0], parts[1]

        # If no comma, treat as province/country only
        return "", location

    def print_summary(
        self, df: pd.DataFrame, json_data: Dict
    ) -> None:
        """Print summary statistics of processed data.

        Args:
            df: Transformed DataFrame
            json_data: JSON structure with metadata
        """
        print("\n" + "=" * 60)
        print("PROCESSING SUMMARY")
        print("=" * 60)
        print(f"Total price records: {len(df)}")
        date_range = json_data["metadata"]["date_range"]
        print(f"Date range: {date_range['min']} to {date_range['max']}")
        print(
            f"\nUnique products: "
            f"{json_data['metadata']['total_products']}"
        )
        print(
            f"Unique categories: "
            f"{json_data['metadata']['total_categories']}"
        )
        print(
            f"Unique locations: "
            f"{json_data['metadata']['total_locations']}"
        )

        print("\nTop 10 Categories:")
        for i, cat in enumerate(json_data["categories"][:10], 1):
            print(f"  {i}. {cat['name']}: {cat['count']} records")

        print("\nSample locations:")
        for loc in json_data["locations"][:5]:
            print(f"  - {loc['location']} ({loc['province']})")

        print("=" * 60)


def main() -> None:
    """Main entry point.

    Parses command-line arguments and runs the processor.
    """
    if len(sys.argv) != 3:
        print(
            "Usage: python process_statscan_to_json.py "
            "input.csv output.json"
        )
        print("\nExample:")
        print(
            "  python process_statscan_to_json.py "
            "data/statscan-full.csv public/data/grocery-data.json"
        )
        sys.exit(1)

    input_file = sys.argv[1]
    output_file = sys.argv[2]

    if not Path(input_file).exists():
        print(f"Error: Input file not found: {input_file}")
        sys.exit(1)

    processor = StatCanJSONProcessor()
    processor.process(input_file, output_file)


if __name__ == "__main__":
    main()

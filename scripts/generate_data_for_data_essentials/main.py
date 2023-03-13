"""
Script to generate sales transactions.

To run, you'll need to install numpy first (`pip install -r requirements.txt`, ideally in a virtual environment)

Run in CMD line with python3 (3.8.10):
`python3 main.py`

"""

from collections import OrderedDict
import datetime
import json
import random
from typing import (Dict, List, OrderedDict)

import numpy as np

"""
Constants
"""

OUTPUT_FILE_PATH = "/home/rav/repos/elara-documentation-projects/data_essentials/10_transform_collection_data/06_concatenate_collections/00/data/brisbane_sales.json"
NUM_TRANSACTIONS_PER_DAY: Dict[datetime.datetime, int] = {
    datetime.datetime(2022, 11, 1): 4,
    datetime.datetime(2022, 11, 2): 5,
    datetime.datetime(2022, 11, 3): 6,
    datetime.datetime(2022, 11, 4): 7,
    datetime.datetime(2022, 11, 5): 14,
    datetime.datetime(2022, 11, 6):15,
    datetime.datetime(2022, 11, 7): 7,
    datetime.datetime(2022, 11, 8): 8,
    datetime.datetime(2022, 11, 9): 3,
    datetime.datetime(2022, 11, 10): 4,
    datetime.datetime(2022, 11, 11): 6,
    datetime.datetime(2022, 11, 12): 12,
    datetime.datetime(2022, 11, 13): 9,
    datetime.datetime(2022, 11, 14): 4,
    datetime.datetime(2022, 11, 15): 5,
}
CODES_PER_TRANSACTION_POISSON_LAMBDA = 0.5 # 1 is added to every sample to ensure more than 0 codes per transaction
UNITS_PER_CODE_POISSON_LAMBDA = 0.25 # 1 is added to every sample to ensure more than 0 items per code

FREQUENCY_DIST_PER_CODE: OrderedDict[str, int] = OrderedDict([
    ("E001", 0.1),
    ("E002", 0.1),
    ("E003", 0.1),
    ("E004", 0.05),
    ("E005", 0.05),
    ("E006", 0.1),
    ("E007", 0.05),
    ("E008", 0.2),
    ("E009", 0.25),
])
SALE_PRICE = {
    "E001": 24.90,
    "E002": 59.90,
    "E003": 19.90,
    "E004": 59.90,
    "E005": 79.90,
    "E006": 199.90,
    "E007": 189.90,
    "E008": 12.50,
    "E009": 5.90
}

BUSINESS_OPEN_HOUR = 9
BUSINESS_CLOSE_HOUR = 17

"""
Utils
"""

def calculate_random_datetime_in_range(day: datetime.datetime) -> datetime.datetime:
    '''Assume uniform sales dist'''
    start_datetime = day + datetime.timedelta(
        days=0,
        seconds=(BUSINESS_OPEN_HOUR * 60 * 60)
    )
    end_datetime = day + datetime.timedelta(
        days=0,
        seconds=(BUSINESS_CLOSE_HOUR * 60 * 60)
    )
    return start_datetime + random.random() * (end_datetime - start_datetime)


def calculate_number_of_codes() -> int:
    return np.random.poisson(lam=CODES_PER_TRANSACTION_POISSON_LAMBDA) + 1


def calculate_codes(num_codes: int) -> List:
    return np.random.choice(
        a=list(FREQUENCY_DIST_PER_CODE.keys()),
        size=num_codes,
        replace=False,
        p=list(FREQUENCY_DIST_PER_CODE.values())
    )


def calculate_units() -> int:
    return np.random.poisson(lam=UNITS_PER_CODE_POISSON_LAMBDA) + 1


def calculate_sales_price(code: str, units: int) -> float:
    return units * SALE_PRICE[code]


def calculate_transaction_total(items: Dict) -> float:
    total = 0
    for item in items:
        total += item["salePrice"]
    return total

"""
Main
"""

def generate_sales_transactions() -> None:
    transactions = []
    for day, num_transactions in NUM_TRANSACTIONS_PER_DAY.items():
        for x in range(num_transactions):
            transaction = {}
            transaction_date = calculate_random_datetime_in_range(day=day)
            transaction["transactionDate"] = transaction_date.strftime('%Y-%m-%dT%H:%M:%S.%f')[0:23] + "Z" # This is trimming the output to match what is in edk-examples as feasible timezone format, perhaps doesn't need to be trimmed
            num_codes = calculate_number_of_codes()
            codes = calculate_codes(num_codes=num_codes)
            items = []
            for code in codes:
                units = calculate_units()
                items.append(
                    {
                        "productCode": code,
                        "units": units,
                        "salePrice": calculate_sales_price(code=code, units=units)
                    }
                )
            # transaction["transactionTotalPrice"] = calculate_transaction_total(items=items)
            transaction["items"] = items
            transactions.append(transaction)

    with open(OUTPUT_FILE_PATH, "w") as output_file:
        json.dump(transactions, output_file, indent=4)


if __name__ == '__main__':
    generate_sales_transactions()

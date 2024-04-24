from mongoengine import Document, StringField, IntField, FloatField, connect, EmbeddedDocument, ListField, EmbeddedDocumentField
from dotenv import dotenv_values
from utils.Orderbook import Order
# DB Setup, can be moved to other file
config = dotenv_values(".env")
URI = config['ATLAS_URI']
DB_NAME = config['DB_NAME']
DSN = URI + DB_NAME
connect(host=DSN)

class OrderDoc(EmbeddedDocument):
    orderId = StringField(required=True)
    datetime = FloatField(required=True)
    side = StringField(required=True)
    price = FloatField(required=True)
    volume = IntField(required=True)
    client = StringField(required=True)

class StrikeDoc(EmbeddedDocument):
    strike_price = FloatField(required=True)
    orders = ListField(EmbeddedDocumentField(OrderDoc))

class ExpiryDoc(EmbeddedDocument):
    expiry_date = StringField(required=True)  # Date in format 'YYYY-MM-DD', probably better to use datetime (easy to chage)
    strikes = ListField(EmbeddedDocumentField(StrikeDoc))

class LedgerEntryDoc(EmbeddedDocument):
    orderId = StringField(required=True)
    matchedIds = ListField(StringField())
    datetime = FloatField(required=True)
    side = StringField(required=True)
    price = FloatField(required=True)
    volume = IntField(required=True)
    client = StringField(required=True)
    strike = FloatField(required=True)
    expiry = StringField(required=True)
    token_pair = StringField(required=True)

class TokenPairDoc(Document):
    token_pair = StringField(required=True, unique=True)
    expiries = ListField(EmbeddedDocumentField(ExpiryDoc))
    ledger = ListField(EmbeddedDocumentField(LedgerEntryDoc)) 




def add_to_db(order: Order, strike: float, expiry: str, pair: str):
    # convert from pydantic model to mongoengine model
    order = OrderDoc(
        orderId=order.orderId,
        datetime=order.datetime,
        side=order.side,
        price=order.price,
        volume=order.volume,
        client=order.client
    )

    # Fetch the token pair document or create it if it doesn't exist
    token_pair_doc, _ = TokenPairDoc.objects.get_or_create(token_pair=pair)

    # Check if the expiry exists
    expiry_doc = None
    for exp in token_pair_doc.expiries:
        if exp.expiry_date == expiry:
            expiry_doc = exp
            break
    
    if not expiry_doc:
        expiry_doc = ExpiryDoc(expiry_date=expiry)
        token_pair_doc.expiries.append(expiry_doc)

    # Check if the strike exists within the found or new expiry
    strike_doc = None
    for strk in expiry_doc.strikes:
        if strk.strike_price == strike:
            strike_doc = strk
            break

    if not strike_doc:
        strike_doc = StrikeDoc(strike_price=strike)
        expiry_doc.strikes.append(strike_doc)

    # Add the order to the strike
    strike_doc.orders.append(order)

    # Save the document
    token_pair_doc.save()

def remove_from_db(order_id: int, strike: float, expiry: str, pair: str):
    # Fetch the token pair document
    token_pair_doc = TokenPairDoc.objects.get(token_pair=pair)

    # Find the expiry
    expiry_doc = None
    for exp in token_pair_doc.expiries:
        if exp.expiry_date == expiry:
            expiry_doc = exp
            break

    # Find the strike
    strike_doc = None
    for strk in expiry_doc.strikes:
        if strk.strike_price == strike:
            strike_doc = strk
            break

    # Find the order
    order_doc = None
    for ord in strike_doc.orders:
        if ord.orderId == order_id:
            order_doc = ord
            break

    # Remove the order
    strike_doc.orders.remove(order_doc)

    # Save the document
    token_pair_doc.save()

def change_order_volume(dVolume, orderId, strike, expiry, token_pair):
    # Fetch the token pair document
    token_pair_doc = TokenPairDoc.objects.get(token_pair=token_pair)

    # Find the expiry
    expiry_doc = None
    for exp in token_pair_doc.expiries:
        if exp.expiry_date == expiry:
            expiry_doc = exp
            break

    # Find the strike
    strike_doc = None
    for strk in expiry_doc.strikes:
        if strk.strike_price == strike:
            strike_doc = strk
            break

    # Find the order
    order_doc = None
    for ord in strike_doc.orders:
        if ord.orderId == orderId:
            order_doc = ord
            break

    # Change the volume
    order_doc.volume += dVolume

    # Save the document
    token_pair_doc.save()

def add_ledger_entry(order: Order, strike: float, expiry: str, token_pair: str, matchedIds: list):
    # convert from pydantic model to mongoengine model
    order = LedgerEntryDoc(
        orderId=order.orderId,
        datetime=order.datetime,
        side=order.side,
        price=order.price,
        volume=order.volume,
        client=order.client,
        strike=strike,
        expiry=expiry,
        token_pair=token_pair,
        matchedIds=matchedIds
    )

    # Fetch the token pair document or create it if it doesn't exist
    token_pair_doc, _ = TokenPairDoc.objects.get_or_create(token_pair=token_pair)

    # Add the order to the ledger
    token_pair_doc.ledger.append(order)

    # Save the document
    token_pair_doc.save()
from main import app
from models.db import db
from models.value import Value

with app.app_context():
    db.create_all()
    values = [10, 20, 30, 40, 50]
    for val in values:
        new_value = Value(value=val)
        db.session.add(new_value)
    db.session.commit()
    print("Database seeded!")

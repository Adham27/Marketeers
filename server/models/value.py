from models.db import db
import uuid

class Value(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    value = db.Column(db.Float, nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "value": self.value,
        }

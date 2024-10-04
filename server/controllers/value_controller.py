from flask import jsonify, request
from flask_jwt_extended import jwt_required
from flask_restx import Namespace, Resource
from models.value import Value
from models.db import db

value_ns = Namespace('Values', description='Value operations', path='/values')

@value_ns.route('/')
class ValueList(Resource):
    @jwt_required()
    def get(self):
        try:
            values = Value.query.all()
            return jsonify([value.serialize() for value in values])
        except Exception as e:
            return jsonify({'msg': str(e)}), 500

    @jwt_required()
    def post(self):
        try:
            data = request.json
            new_value = Value(value=data['value'])
            db.session.add(new_value)
            db.session.commit()
            return jsonify({'message': 'Value added successfully', 'id': new_value.id})
        except Exception as e:
            return jsonify({'msg': str(e)}), 500

@value_ns.route('/<string:value_id>')
class ValueDetail(Resource):
    @jwt_required()
    def get(self, value_id):
        try:
            value = Value.query.get(value_id)
            if value:
                return jsonify(value.serialize())
            else:
                return jsonify({'message': 'Value not found'}), 404
        except Exception as e:
            return jsonify({'msg': str(e)}), 500

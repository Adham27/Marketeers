from flask import current_app as app, request, jsonify
from flask_restx import Namespace ,Resource
from models.base_model import db
from models.users import User
import os
from werkzeug.utils import secure_filename
from passlib.hash import pbkdf2_sha256
from flask_jwt_extended import create_access_token, create_refresh_token, get_jwt, get_jwt_identity, jwt_required, set_access_cookies, set_refresh_cookies, unset_jwt_cookies 
# Create a Namespace for authentication operations
auth = Namespace('Auth', description='Authentication operations', path='/auth')

@auth.route('/signup')
class Signup(Resource):
    @auth.expect(User)
    def post(self):
        try:  
            data = request.form
            # Check if password matches confirmation password
            if data['password'] != data['confirm_password']:
                return jsonify({'message': 'Password and confirmation password do not match'})
            # Hash the password before storing it using passlib
            hashed_password = pbkdf2_sha256.hash(data['password'])
           # handling the image 
            new_user = User(
                first_name=data['first_name'],
                last_name=data['last_name'],
                email=data['email'],
                password=hashed_password,
                phone_number=data['phone_number'],
                zipcode=data['zipcode'],
            )
            print(new_user)
            db.session.add(new_user)
            db.session.commit()
            return jsonify({
                'message': 'User created successfully',
            })
        except Exception as e:
            print(e)
            return {'msg': str(e)},400


@auth.route('/login')
class Login(Resource):
    @auth.expect(User)
    def post(self):
        try:
            data = request.json
            email = data.get('email')
            password = data.get('password')
            user = User.query.filter_by(email=email).first()
            if user:
                print("Retrieved user:", user)
                print("Password from request:", password)

                if pbkdf2_sha256.verify(str(password), user.password):
                    access_token = create_access_token(identity=user.id, fresh=True)
                    refresh_token = create_refresh_token(identity=user.id)
                    resp = jsonify({
                        "user_id":user.id,
                        "first_name": user.first_name,
                        'last_name': user.last_name,
                        'email': user.email,
                        'role': user.role,
                        "access_token": access_token,
                        "refresh_token":refresh_token
                    })
                    set_access_cookies(resp, access_token)
                    set_refresh_cookies(resp, refresh_token)
                    resp.set_cookie('user_id', str(user.id))
                    return resp
                else:
                    print("Password incorrect")
                    return jsonify({'message': 'Invalid email or password'}), 401
            else:
                print("User not found")
                return jsonify({'message': 'User not found'}), 404
        except Exception as e:
            return {'msg': str(e)}, 500

@auth.route('/logout')
class Logout(Resource):
  @jwt_required()
  def delete(self):
    try:
        current_user = get_jwt_identity()
        resp = jsonify({
        'logout': True,
        'user': current_user
        })
        unset_jwt_cookies(resp)
        return resp
    except Exception as e:
        return {'msg': e}, 500
  
#!/usr/bin/python3
""" holds class User"""
import models
from models.base_model import BaseModel, Base
from hashlib import md5
from os import getenv
import sqlalchemy
from sqlalchemy import Column, String
from sqlalchemy.orm import relationship


class User(BaseModel, Base):
    """Representation of a user """
    if models.storage_t == 'db':
        __tablename__ = 'users'
        email = Column(String(128), nullable=False)
        password = Column(String(128), nullable=False)
        first_name = Column(String(128), nullable=True)
        last_name = Column(String(128), nullable=True)
        places = relationship("Place", backref="user", cascade="delete")
        reviews = relationship("Review", backref="user", cascade="delete")
    else:
        email = ""
        password = ""
        first_name = ""
        last_name = ""

    def __init__(self, *args, **kwargs):
        """initializes user"""
        hash = md5()
        if kwargs:
            hash.update(kwargs["password"].encode('utf-8'))
            kwargs["password"] = hash.hexdigest()
        super().__init__(*args, **kwargs)

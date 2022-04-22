from cgitb import reset
import mysql.connector
import logging
from mysql.connector.cursor import MySQLCursorPrepared

LOGGER = logging.getLogger(__name__)


class Database():

    def check_queue(self, db_connection):  # retrieve data from customer statement queue
        try:
            sql = '''SELECT destination, origin, message, id from smsQueue LIMIT 1000'''
            cursor = db_connection.cursor(dictionary=True)
            # params = (0, "")
            cursor.execute(sql)
            result = cursor.fetchall()
            # print(result)
        except mysql.connector.Error as err:
            print(err)
            raise
        return result

    def deleteQueue(self, db_connection, id):
        try:
            sql = """DELETE FROM smsQueue WHERE id = %s"""
            params = (id,)
            cursor = db_connection.cursor(prepared=True)
            cursor.execute(sql, params)
        except mysql.connector.Error as err:
            print(err)
            raise
        return True

    def insertSMSLogs(self, db_connection, destination, origin, message, status):
        try:
            sql = """INSERT INTO sms_logs (destination, origin, message, status) VALUES (%s, %s, %s, %s)"""
            params = (destination, origin, message, status)
            cursor = db_connection.cursor(prepared=True)
            cursor.execute(sql, params)
        except mysql.connector.Error as err:
            print(err)
            raise        
        return True

    def update_users(self, db_connection,  id):
        try:
            sql = """UPDATE users SET client_id=%s WHERE id=%s"""
            params = (id, id)
            cursor = db_connection.cursor(dictionary=True)
            cursor.execute(sql, params)
            # result = cursor.rowcount
            # # LOGGER.info(result)
        except mysql.connector.Error as err:
            print(err)
            raise
        return True

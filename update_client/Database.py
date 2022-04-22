from cgitb import reset
import mysql.connector
import logging
from mysql.connector.cursor import MySQLCursorPrepared

LOGGER = logging.getLogger(__name__)


class Database():

    def check_queue(self, db_connection):  # retrieve data from customer statement queue
        try:
            sql = '''SELECT admin_role, id, client_id, email, company_name from users where id <> client_id and admin_role =1 LIMIT 1'''
            cursor = db_connection.cursor(dictionary=True)
            # params = (0, "")
            cursor.execute(sql)
            result = cursor.fetchone()
            # print(result)
        except mysql.connector.Error as err:
            print(err)
            raise
        return result

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

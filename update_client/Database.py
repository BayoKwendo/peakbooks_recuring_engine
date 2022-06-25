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

    def update_users_verification(self, db_connection):
        try:
            sql = """UPDATE peakbooks.verification SET status = 1 WHERE status = 0 AND expired  < UNIX_TIMESTAMP(NOW())"""
            cursor = db_connection.cursor(dictionary=True)
            cursor.execute(sql)
            # result = cursor.rowcount
            # # LOGGER.info(result)
        except mysql.connector.Error as err:
            print(err)
            raise
        return True

    def update_users_ourclient(self, db_connection):
        try:
            sql = """UPDATE peakbooks.users SET paid = 0, first_time = 0 WHERE subscription < NOW() AND our_client = 1"""
            cursor = db_connection.cursor(dictionary=True)
            cursor.execute(sql)
            result = cursor.rowcount
            # # LOGGER.info(result)
        except mysql.connector.Error as err:
            print(err)
            raise
        return True

    def update_users_passwordreset(self, db_connection):
        try:
            sql = """UPDATE peakbooks.password_reset SET status = 1 WHERE expired < UNIX_TIMESTAMP(NOW())"""
            cursor = db_connection.cursor(dictionary=True)
            cursor.execute(sql)
            # result = cursor.rowcount
            # # LOGGER.info(result)
        except mysql.connector.Error as err:
            print(err)
            raise
        return True

    def update_users_login_status(self, db_connection):
        try:
            sql = """UPDATE peakbooks.users SET login_status = 0 WHERE login_expiry < UNIX_TIMESTAMP(NOW()) AND login_status = 1"""
            cursor = db_connection.cursor(dictionary=True)
            cursor.execute(sql)
            # result = cursor.rowcount
            # # LOGGER.info(result)
        except mysql.connector.Error as err:
            print(err)
            raise
        return True

    def update_checked(self, db_connection):
        try:
            sql = """UPDATE peakbooks.users SET checked = 0"""
            cursor = db_connection.cursor(dictionary=True)
            cursor.execute(sql)
            # result = cursor.rowcount
            # # LOGGER.info(result)
        except mysql.connector.Error as err:
            print(err)
            raise
        return True

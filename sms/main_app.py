# -*- coding: utf-8 -*-
# pylint: disable=C0111,C0103,R0205
from calendar import c
from cmath import log
from code import interact
# import json
import sys
import asyncio
import requests

import logging
import time
import mysql.connector
import yaml
import datetime

from mysql.connector import errorcode
from Database import Database

# reduce log level
logging.getLogger("pika").setLevel(logging.INFO)
logging.getLogger("pika").propagate = False

LOG_FORMAT = ('%(levelname) -10s %(asctime)s %(name) -30s %(funcName) '
              '-35s %(lineno) -5d: %(message)s')

LOGGER = logging.getLogger(__name__)


class MainApp(object):
    def __init__(self, cfg, app_name):  # constructor
        """Create a new instance of the mainapp class, passing in the AMQP
        :param str amqp_url: The AMQP url to connect with
        """
        self.should_reconnect = False
        self.was_consuming = False
        self._cfg = cfg
        self._channel = None
        self._connection = None

        self._closing = False
        self._consumer_tag = None
        self._consuming = False
        self._app_name = app_name
        # In production, experiment with higher prefetch values
        # for higher consumer throughput
        # self._prefetch_count = cfg[app_name]['prefetch_count']
        self._prefetch_count = 200
        self._app_cfg = cfg[app_name]

    def db_connect(self):  # databases
        """ Creates a connection to mysql Database """
        try:
            return mysql.connector.connect(

                host=self._cfg['mysql']['host'],

                user=self._cfg['mysql']['user'],

                password=self._cfg['mysql']['passwd'],

                database=self._cfg['mysql']['db'],

                port=self._cfg['mysql']['port']

            )
        except mysql.connector.Error as err:
            LOGGER.error('Mysql Connection Failed %s', err)
            raise

    def close_db_connection(self):
        """This method closes the connection to MYSQL."""
        # LOGGER.info('Closing Database connection')
        self._conn.close()

    async def run(self):
        """MYSQL"""
        try:
            LOGGER.info('Connected to mysql')
            self._conn = self.db_connect()
            self._conn.autocommit = True
            self._mysql = Database()
            await self.process_sms()

        except mysql.connector.Error as err:
            LOGGER.info('MySQL Error %s', err)
            self.stop()

    async def stop(self):
        self.close_db_connection()
        self._closing = False
        await asyncio.sleep(1)  # wait for 30 seconds
        # LOGGER.info('Connected to mysql')
        self._conn = self.db_connect()
        self._conn.autocommit = True
        self._mysql = Database()

    async def process_sms(self):
        """Process loan"""
        while not self._closing:
            try:
                # LOGGER.info('Processing loan')
                self._closing = True

                checkLoan = self._mysql.check_queue(self._conn)
                if len(checkLoan) > 0:
                    # LOGGER.info(checkLoan)  # from loan customer queue
                    for x in checkLoan:
                        id = x['id']
                        id = x['id']
                        self._mysql.update_users(
                            self._conn, id)
                        
                        dest =x['destination']
                        data = {
                            'apiKey': self._cfg['sms']['APIKEY'],
                            'shortCode': self._cfg['sms']['SENDERID'],
                            'callbackURL': self._cfg['sms']['CALL_BACK'],
                            'recipient': dest.replace(" ", "").replace("+", ""),
                            'enqueue': 0,
                            'message': x['message']
                            }
                        
                        LOGGER.info(data)
                        headers = {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        }
                        requests.post(
                            url=self._cfg['sms']['URL'], headers=headers, json=data)
                        
                        # print(ctx.text)
                        self._mysql.insertSMSLogs(self._conn,  x['destination'], x['origin'], x['message'], '1')
                        self._mysql.deleteQueue(self._conn, id)
                                                
                    await self.stop()
                else:
                    await self.stop()
                    # LOGGER.info("here")
            except KeyboardInterrupt:
                # self.stop()
                break


class ReconnectingLoan(object):
    """This is an example consumer that will reconnect if the nested
    ExampleConsumer indicates that a reconnect is necessary.
    """

    def __init__(self, cfg, app_name):
        self._reconnect_delay = 0
        self._cfg = cfg
        self._app_name = app_name
        self._consumer = MainApp(self._cfg, self._app_name)

    async def run(self):
        try:
            await self._consumer.run()
        except KeyboardInterrupt:
            self._consumer.stop()
        self._maybe_reconnect()

    def _maybe_reconnect(self):
        if self._consumer.should_reconnect:
            self._consumer.stop()
            reconnect_delay = self._get_reconnect_delay()
            LOGGER.info('Reconnecting after %d seconds', reconnect_delay)
            time.sleep(reconnect_delay)
            self._consumer = MainApp(self._cfg, self._app_name)

    def _get_reconnect_delay(self):
        if self._consumer.was_consuming:
            self._reconnect_delay = 0
        else:
            self._reconnect_delay += 1
        if self._reconnect_delay > 30:
            self._reconnect_delay = 30
        return self._reconnect_delay


def service_init(args, cfg):
    """Initialise service
    """
    if len(args) < 2:
        LOGGER.error("USAGE: python %s <app_name>" % args[0])
        exit(0)
    elif sys.argv[1] not in cfg:
        LOGGER.error(
            'Invalid Args: App %s must be in the config file' % args[1])
        exit(0)
    else:
        LOGGER.info('%s: Started! Name: %s'
                    % (datetime.datetime.now(), args))


async def main():

    logging.basicConfig(level=logging.DEBUG, format=LOG_FORMAT)
    with open("./config.yml", "r") as ymlfile:
        cfg = yaml.load(ymlfile, Loader=yaml.FullLoader)
    app_name = sys.argv[1:]
    service_init(sys.argv, cfg)

    client = ReconnectingLoan(cfg, app_name[0])
    await client.run()


if __name__ == '__main__':
    asyncio.run(main())

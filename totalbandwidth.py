import codecs  # UTF-8 support for the text files
import datetime
import json


def text2file(txt, filename):
    """Write the txt to the file."""
    outputfile = codecs.open(filename, "a", "utf-8")
    outputfile.write(txt)
    outputfile.close()

json_data=open('/var/www/html/finnish-tor-campaign/relays_fi.json')
data = json.load(json_data)
json_data.close()

total = 0
for relay in data["relays"]:
    total = total + relay["observed_bandwidth"]

total = total/1024

textline = str(datetime.date.today()) + ":" + str(total) + "\n"

text2file(textline, "/var/www/html/finnish-tor-campaign/totalbandwidth.txt")

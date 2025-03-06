from locust import HttpUser, task, constant_throughput
import random, uuid, time, json, requests

#  locust -f misc/locust.py --headless -u 10000 -r 100 -t 40  --host localhost  --processes 5

headers = {"content-type": "application/json"}
admin_host = "http://localhost:3000"
cache_host = "http://localhost:"  # no port

class CacheTest(HttpUser):
    wait_time = constant_throughput(0.75)
    members = None

    def on_start(self):
        self.members = self.get_members()
        self.counter = 0

    def get_members(self):
        r = requests.get(admin_host+'/admin/members')
        python_dict = json.loads(r.text)
        return list(python_dict.values())
    @task
    def hello_world(self):
        self.counter += 1

        if self.counter % 500 == 0:
            self.members = self.get_members()
        port = str(random.choice(self.members))
        r = self.client.put(cache_host+port+'/cache/a/b')
        r = self.client.get(cache_host+port+'/cache/a')

import random, uuid, time, requests, json

admin_host = "http://localhost:3000"
host = "http://localhost"
headers = {"content-type": "application/json"}

ts = time.time_ns() // 1_000_000

# txn_1 = {
#   "transaction": {
#     "type": 2,
#     "id": 7777777,
#     "date": ts
#   },    
#   "entries": [
#     {   
#       "amount": 1000,
#       "account_path": "/assets/bank/cash",
#       "direction": DEBIT
#     },
#     { 
#       "amount": 1000,
#       "account_path": "/liabilities/bigbank/cash",
#       "direction": CREDIT
#     }   
#   ]     
# }       
# for i in range(100):
#     r = requests.put(host+'/cache/a/b')
#     print(r.text)

r = requests.get(admin_host+'/admin/members')
print(r.text)
print(r.json())

python_dict = json.loads(r.text)
print(random.choice(list(python_dict.values())))
r = requests.put(host+':3000/cache/a/b')
print(r.text)
print(r.json())
r = requests.get(host+':3000/cache/a')
print(r.text)
print(r.json())
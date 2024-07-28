
## VakyaVahan
### API to Create New User
- Route name: `/new-user`
- Method: `POST`
- `Content-Type`: `application/json`
- Required Params: `name`, `org`, `deviceid`
- Success Response: 
```json
{
    "status": 200,
    "message": "Ok",
    "authtoken": "token",
    "clienttoken": "token"
}
```
### API to Check User Existence
- Route name: `/check-exists`
- Method: `POST`
- `Content-Type`: `application/json`
- Required Params: `deviceid`
- Success Response
```json
{
    "status": 200,
    "message": "Ok",
    "authtoken": "token",
    "clienttoken": "token"
}
```
- Not Found Response
```json
{
    "status": 404,
    "message": "Not found"
}
```

### Send SMS API
- Route name: `/send-sms`
- Method: `POST`
- `Content-Type`: `application/x-www-form-urlencoded`
- Required Params: `authtoken`, `message`, `target`
- Success Response
```json
{ "status": "200", "message": "Ok" }
```
- Error Response
```json
{ "status": "410", "message": "No client is available" }
```
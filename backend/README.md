1. Install the dependencies

```
pip install -r requirements.txt
```

2. Run the server

```
uvicorn main:app --reload --port 8001
```

3. To login to GitHub

```
http://localhost:8001/github/login
```

4. Check whether logged in using the following

```
http://localhost:8001/
```

5. Check the API documentation using the following

```
http://localhost:8001/docs
```

from flask import Flask

# App Config
app = Flask(__name__)

#Routes
@app.route('/')
def home():
    return "Sup Niggas"

#Main Process
if __name__ == '__main__':
    app.run()

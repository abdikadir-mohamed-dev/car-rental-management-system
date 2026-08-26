import os
import sys

sys.path.insert(0, os.path.dirname(__file__))

from app import create_app
from app import create_app, db

app = create_app()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5000)

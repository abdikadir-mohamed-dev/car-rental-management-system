from app import create_app, db
from app.utils.mock_data import seed_data

app = create_app()

with app.app_context():
    db.create_all()
    seed_data()
    print('Database initialized and seeded.')

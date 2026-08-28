from app.extensions import db
from datetime import datetime


class Report(db.Model):
    __tablename__ = 'reports'

    id = db.Column(db.Integer, primary_key=True)
    report_type = db.Column(db.String(80), nullable=False)
    period = db.Column(db.String(50))
    data = db.Column(db.JSON, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            '_id': str(self.id),
            'reportType': self.report_type,
            'period': self.period,
            'data': self.data,
            'createdAt': self.created_at.isoformat() if self.created_at else None,
        }

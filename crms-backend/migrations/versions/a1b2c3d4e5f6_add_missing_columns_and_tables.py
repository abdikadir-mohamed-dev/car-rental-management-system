"""Add missing columns and tables for admin backend

Revision ID: a1b2c3d4e5f6
Revises: ce6e43605841
Create Date: 2026-08-27 22:30:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'a1b2c3d4e5f6'
down_revision = 'ce6e43605841'
branch_labels = None
depends_on = None


def upgrade():
    # Users table - add missing columns
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.add_column(sa.Column('license_number', sa.String(length=50), nullable=True))
        batch_op.add_column(sa.Column('drivers_license', sa.String(length=50), nullable=True))
        batch_op.add_column(sa.Column('license_expiry', sa.String(length=20), nullable=True))
        batch_op.add_column(sa.Column('country', sa.String(length=50), nullable=True))
        batch_op.add_column(sa.Column('profile_photo', sa.String(length=255), nullable=True))
        batch_op.add_column(sa.Column('reset_password_token', sa.String(length=120), nullable=True))
        batch_op.add_column(sa.Column('reset_password_expire', sa.Integer(), nullable=True))

    # Vehicles table - add missing columns
    with op.batch_alter_table('vehicles', schema=None) as batch_op:
        batch_op.add_column(sa.Column('name', sa.String(length=100), nullable=True))
        batch_op.add_column(sa.Column('brand', sa.String(length=50), nullable=True))
        batch_op.add_column(sa.Column('price_per_day', sa.Float(), nullable=True))
        batch_op.add_column(sa.Column('image', sa.String(length=255), nullable=True))
        batch_op.add_column(sa.Column('rating', sa.Float(), nullable=True, server_default='4.5'))
        batch_op.add_column(sa.Column('is_available', sa.Boolean(), nullable=True, server_default='true'))
        batch_op.add_column(sa.Column('unavailable_dates', sa.Text(), nullable=True, server_default='[]'))
        batch_op.add_column(sa.Column('doors', sa.Integer(), nullable=True, server_default='4'))
        batch_op.add_column(sa.Column('luggage', sa.Integer(), nullable=True, server_default='2'))
        batch_op.add_column(sa.Column('seats', sa.Integer(), nullable=True, server_default='5'))
        batch_op.add_column(sa.Column('fuel_type_customer', sa.String(length=20), nullable=True, server_default='petrol'))
        batch_op.add_column(sa.Column('assigned_driver_id', sa.Integer(), nullable=True))
        batch_op.create_foreign_key('fk_vehicles_assigned_driver', 'drivers', ['assigned_driver_id'], ['id'])

    # Bookings table - add missing columns
    with op.batch_alter_table('bookings', schema=None) as batch_op:
        batch_op.add_column(sa.Column('return_location', sa.String(length=255), nullable=True))
        batch_op.add_column(sa.Column('dropoff_location', sa.String(length=255), nullable=True))
        batch_op.add_column(sa.Column('dropoff_date', sa.DateTime(), nullable=True))
        batch_op.add_column(sa.Column('total_amount_customer', sa.Float(), nullable=True))
        batch_op.add_column(sa.Column('cancellation_reason', sa.String(length=255), nullable=True))
        batch_op.add_column(sa.Column('cancellation_fee', sa.Float(), nullable=True, server_default='0'))
        batch_op.add_column(sa.Column('refund_amount', sa.Float(), nullable=True, server_default='0'))
        batch_op.add_column(sa.Column('driving_option', sa.String(length=20), nullable=True, server_default='self'))
        batch_op.add_column(sa.Column('trip_id', sa.Integer(), nullable=True))
        batch_op.create_foreign_key('fk_bookings_trip', 'trips', ['trip_id'], ['id'])

    # Payments table - add missing columns
    with op.batch_alter_table('payments', schema=None) as batch_op:
        batch_op.add_column(sa.Column('customer_id', sa.Integer(), nullable=False, server_default='1'))
        batch_op.add_column(sa.Column('mpesa_receipt_number', sa.String(length=120), nullable=True))
        batch_op.add_column(sa.Column('paid_at', sa.DateTime(), nullable=True))
        batch_op.add_column(sa.Column('date', sa.Date(), nullable=False, server_default='1970-01-01'))
        batch_op.create_foreign_key('fk_payments_customer', 'users', ['customer_id'], ['id'])

    # Create drivers table
    op.create_table('drivers',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('license_number', sa.String(length=50), nullable=False),
        sa.Column('status', sa.String(length=20), nullable=True, server_default='available'),
        sa.Column('rating', sa.Float(), nullable=True, server_default='0'),
        sa.Column('total_trips', sa.Integer(), nullable=True, server_default='0'),
        sa.Column('joined_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('license_number')
    )

    # Create customers table
    op.create_table('customers',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('total_bookings', sa.Integer(), nullable=True, server_default='0'),
        sa.Column('joined_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

    # Create maintenance table
    op.create_table('maintenance',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('vehicle_id', sa.Integer(), nullable=False),
        sa.Column('issue', sa.String(length=200), nullable=False),
        sa.Column('priority', sa.String(length=20), nullable=True, server_default='Medium'),
        sa.Column('status', sa.String(length=20), nullable=True, server_default='Open'),
        sa.Column('date', sa.String(length=20), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['vehicle_id'], ['vehicles.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

    # Create inspections table
    op.create_table('inspections',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('booking_id', sa.Integer(), nullable=True),
        sa.Column('vehicle_id', sa.Integer(), nullable=False),
        sa.Column('inspector_id', sa.Integer(), nullable=True),
        sa.Column('type', sa.String(length=20), nullable=True),
        sa.Column('mileage', sa.Integer(), nullable=True),
        sa.Column('fuel_level', sa.String(length=20), nullable=True),
        sa.Column('condition', sa.Text(), nullable=True),
        sa.Column('damage_notes', sa.Text(), nullable=True),
        sa.Column('status', sa.String(length=20), nullable=True, server_default='pending'),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['booking_id'], ['bookings.id'], ),
        sa.ForeignKeyConstraint(['inspector_id'], ['users.id'], ),
        sa.ForeignKeyConstraint(['vehicle_id'], ['vehicles.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

    # Create trips table
    op.create_table('trips',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('driver_id', sa.Integer(), nullable=False),
        sa.Column('vehicle_id', sa.Integer(), nullable=False),
        sa.Column('customer_id', sa.Integer(), nullable=True),
        sa.Column('pickup_location', sa.String(length=200), nullable=False),
        sa.Column('dropoff_location', sa.String(length=200), nullable=False),
        sa.Column('date', sa.Date(), nullable=False),
        sa.Column('time', sa.String(length=20), nullable=False),
        sa.Column('distance_km', sa.Integer(), nullable=True),
        sa.Column('fare', sa.Float(), nullable=False),
        sa.Column('status', sa.String(length=20), nullable=True, server_default='upcoming'),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['customer_id'], ['customers.id'], ),
        sa.ForeignKeyConstraint(['driver_id'], ['drivers.id'], ),
        sa.ForeignKeyConstraint(['vehicle_id'], ['vehicles.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

    # Create notifications table
    op.create_table('notifications',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(length=100), nullable=False),
        sa.Column('message', sa.Text(), nullable=False),
        sa.Column('read', sa.Boolean(), nullable=True, server_default='false'),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

    # Create earnings table
    op.create_table('earnings',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('driver_id', sa.Integer(), nullable=False),
        sa.Column('trip_id', sa.Integer(), nullable=True),
        sa.Column('amount', sa.Float(), nullable=False),
        sa.Column('status', sa.String(length=20), nullable=True, server_default='pending'),
        sa.Column('date', sa.Date(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['driver_id'], ['drivers.id'], ),
        sa.ForeignKeyConstraint(['trip_id'], ['trips.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

    # Create driver_assignments table
    op.create_table('driver_assignments',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('booking_id', sa.Integer(), nullable=False),
        sa.Column('driver_id', sa.Integer(), nullable=False),
        sa.Column('status', sa.String(length=20), nullable=True, server_default='pending'),
        sa.Column('assigned_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['booking_id'], ['bookings.id'], ),
        sa.ForeignKeyConstraint(['driver_id'], ['drivers.id'], ),
        sa.PrimaryKeyConstraint('id')
    )


def downgrade():
    # Drop new tables
    op.drop_table('driver_assignments')
    op.drop_table('earnings')
    op.drop_table('notifications')
    op.drop_table('trips')
    op.drop_table('inspections')
    op.drop_table('maintenance')
    op.drop_table('customers')
    op.drop_table('drivers')

    # Remove added columns from bookings
    with op.batch_alter_table('bookings', schema=None) as batch_op:
        batch_op.drop_constraint('fk_bookings_trip', type_='foreignkey')
        batch_op.drop_column('trip_id')
        batch_op.drop_column('driving_option')
        batch_op.drop_column('refund_amount')
        batch_op.drop_column('cancellation_fee')
        batch_op.drop_column('cancellation_reason')
        batch_op.drop_column('total_amount_customer')
        batch_op.drop_column('dropoff_date')
        batch_op.drop_column('dropoff_location')
        batch_op.drop_column('return_location')

    # Remove added columns from payments
    with op.batch_alter_table('payments', schema=None) as batch_op:
        batch_op.drop_constraint('fk_payments_customer', type_='foreignkey')
        batch_op.drop_column('date')
        batch_op.drop_column('paid_at')
        batch_op.drop_column('mpesa_receipt_number')
        batch_op.drop_column('customer_id')

    # Remove added columns from vehicles
    with op.batch_alter_table('vehicles', schema=None) as batch_op:
        batch_op.drop_constraint('fk_vehicles_assigned_driver', type_='foreignkey')
        batch_op.drop_column('assigned_driver_id')
        batch_op.drop_column('fuel_type_customer')
        batch_op.drop_column('seats')
        batch_op.drop_column('luggage')
        batch_op.drop_column('doors')
        batch_op.drop_column('unavailable_dates')
        batch_op.drop_column('is_available')
        batch_op.drop_column('rating')
        batch_op.drop_column('image')
        batch_op.drop_column('price_per_day')
        batch_op.drop_column('brand')
        batch_op.drop_column('name')

    # Remove added columns from users
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.drop_column('reset_password_expire')
        batch_op.drop_column('reset_password_token')
        batch_op.drop_column('profile_photo')
        batch_op.drop_column('country')
        batch_op.drop_column('license_expiry')
        batch_op.drop_column('drivers_license')
        batch_op.drop_column('license_number')

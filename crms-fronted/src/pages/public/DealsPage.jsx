import { Tag } from "lucide-react";

function DealsPage() {
  return (
    <div>
      <section className="bg-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">DriveGo Car Rental Deals</h1>
          <p className="text-xl text-blue-100">
            Exclusive offers and discounts in Nairobi, Kenya
          </p>
        </div>
      </section>
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card p-6 border-2 border-primary">
              <Tag className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                20% Off First Rental
              </h3>
              <p className="text-slate-600 mb-4">
                New customers get 20% off their first booking. Use code: FIRST20
              </p>
              <button className="btn-primary">Claim Offer</button>
            </div>
            <div className="card p-6 border-2 border-primary">
              <Tag className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Weekend Special
              </h3>
              <p className="text-slate-600 mb-4">
                Book Friday to Sunday and save 15%. Perfect for weekend
                getaways.
              </p>
              <button className="btn-primary">Claim Offer</button>
            </div>
            <div className="card p-6 border-2 border-primary">
              <Tag className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Long-Term Rental
              </h3>
              <p className="text-slate-600 mb-4">
                Rent for 30 days or more and save 25% on your DriveGo booking.
              </p>
              <button className="btn-primary">Claim Offer</button>
            </div>
            <div className="card p-6 border-2 border-primary">
              <Tag className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Refer a Friend
              </h3>
              <p className="text-slate-600 mb-4">
                Refer a friend to DriveGo and both of you get KES 1,000 off.
              </p>
              <button className="btn-primary">Claim Offer</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default DealsPage;

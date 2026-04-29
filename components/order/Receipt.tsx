import { formatPrice } from "@/lib/utils";
import ArtisanLogo from "@/components/ui/ArtisanLogo";

export default function Receipt({ order }: { order: any }) {
  if (!order) return null;
  const createdAt = order.created_at || order.createdAt || new Date();

  return (
    <div className="hidden print:block bg-white text-black px-8 font-sans w-full max-w-4xl mx-auto">
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media print {
              @page { margin: 0mm 0mm; }
            }
          `,
        }}
      />
      {/* Header */}
      <div className="flex justify-between items-start mb-6 border-b border-gray-200 pb-4">
        <div>
          <div className="mb-4">
            <ArtisanLogo />
          </div>
          <p className="text-sm text-gray-500 mt-2">
            artisanhouse.in@gmail.com
          </p>
          <p className="text-sm text-gray-500">+91 95194 86785</p>
        </div>
        <div className="text-right">
          <h2 className="text-3xl font-bold text-gray-300 mb-2 uppercase tracking-widest">
            Receipt
          </h2>
          <p className="text-sm">
            <span className="font-semibold">Order:</span> #{order.id}
          </p>
          <p className="text-sm mt-1">
            <span className="font-semibold">Date:</span>{" "}
            {new Date(createdAt).toLocaleDateString("en-IN", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Billed To */}
      <div className="mb-6">
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
          Billed To
        </h3>
        <p className="text-base font-semibold">
          {(order.shipping_address || order.shippingAddress)?.fullName}
        </p>
        <p className="text-sm text-gray-600 mt-1">
          {(order.shipping_address || order.shippingAddress)?.address1}
        </p>
        {(order.shipping_address || order.shippingAddress)?.address2 && (
          <p className="text-sm text-gray-600">
            {(order.shipping_address || order.shippingAddress)?.address2}
          </p>
        )}
        <p className="text-sm text-gray-600">
          {(order.shipping_address || order.shippingAddress)?.city},{" "}
          {(order.shipping_address || order.shippingAddress)?.state}{" "}
          {(order.shipping_address || order.shippingAddress)?.postalCode}
        </p>
        {(order.shipping_address || order.shippingAddress)?.phone && (
          <p className="text-sm text-gray-600 mt-1">
            Phone: {(order.shipping_address || order.shippingAddress)?.phone}
          </p>
        )}
      </div>

      {/* Order Items Table */}
      <table className="w-full mb-6">
        <thead>
          <tr className="border-b-2 border-gray-200 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">
            <th className="pb-2 w-3/5">Item</th>
            <th className="pb-2 text-center">Qty</th>
            <th className="pb-2 text-right">Price</th>
            <th className="pb-2 text-right">Total</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {order.items?.map((item: any, i: number) => (
            <tr key={i} className="border-b border-gray-100">
              <td className="py-2 pr-4">
                <p className="font-semibold text-black">{item.productName}</p>
                {item.giftSet && (
                  <p className="text-xs text-gray-500 mt-1">
                    Gift Set Included
                  </p>
                )}
                {!item.giftSet &&
                  item.customizations &&
                  Object.entries(item.customizations).length > 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      {Object.entries(item.customizations)
                        .map(([k, v]) => `${k}: ${v}`)
                        .join(" · ")}
                    </p>
                  )}
              </td>
              <td className="py-2 text-center">{item.quantity}</td>
              <td className="py-2 text-right">{formatPrice(item.price)}</td>
              <td className="py-2 text-right font-semibold text-black">
                {formatPrice(item.price * item.quantity)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="flex justify-end break-inside-avoid">
        <div className="w-1/2 space-y-3 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>{formatPrice(order.subtotal || 0)}</span>
          </div>
          {order.discount && order.discount > 0 ? (
            <div className="flex justify-between text-green-600">
              <span>
                Discount {order.discountCode ? `(${order.discountCode})` : ""}
              </span>
              <span>-{formatPrice(order.discount)}</span>
            </div>
          ) : null}
          <div className="flex justify-between text-gray-600">
            <span>Shipping</span>
            <span>
              {order.shipping === 0 ? "Free" : formatPrice(order.shipping || 0)}
            </span>
          </div>
          <div className="flex justify-between font-bold text-lg text-black pt-4 border-t border-gray-200 mt-4">
            <span>Total</span>
            <span>{formatPrice(order.total || 0)}</span>
          </div>
        </div>
      </div>

      {/* Footer Note & QR Code */}
      <div className="mt-8 flex justify-between items-end border-t border-gray-100 pt-4 break-inside-avoid">
        <div className="text-sm text-gray-400">
          <p>Thank you for shopping with Artisan House.</p>
          <p className="mt-1 italic">Each piece tells a story.</p>
        </div>
        <div className="text-center flex flex-col items-center">
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(
              typeof window !== "undefined"
                ? window.location.origin + "/order/" + order.id
                : "https://artisanhouse.in",
            )}`}
            alt="Order Tracking QR Code"
            className="w-20 h-20"
          />
          <p className="text-[10px] text-gray-400 mt-2 uppercase tracking-widest">
            Track Order
          </p>
        </div>
      </div>
    </div>
  );
}

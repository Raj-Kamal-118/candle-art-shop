import { CartItem } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { Gift } from "lucide-react";

interface OrderSummaryProps {
  items: CartItem[];
  discount?: number;
  discountCode?: string;
  codFee?: number;
  shipping: number;
  giftWrapFee?: number;
  greetingCardFee?: number;
}

export default function OrderSummary({
  items,
  discount = 0,
  discountCode,
  codFee = 0,
  shipping,
  giftWrapFee = 0,
  greetingCardFee = 0,
}: OrderSummaryProps) {
  const subtotal = items.reduce(
    (sum, item) => sum + (item.price ?? item.product.price) * item.quantity,
    0,
  );
  const total =
    subtotal - discount + shipping + codFee + giftWrapFee + greetingCardFee;

  return (
    <div className="bg-white dark:bg-[#1a1830] rounded-3xl border border-[rgba(122,80,40,0.18)] dark:border-amber-900/20 overflow-hidden shadow-[0_14px_30px_rgba(67,44,26,0.10),0_2px_6px_rgba(0,0,0,0.04)] dark:shadow-[0_14px_30px_rgba(0,0,0,0.25)]">
      {/* Head */}
      <div className="pt-5 pb-3 px-5">
        <h3 className="ah-display-md text-[20px] font-bold text-brown-900 dark:text-amber-50">
          Your{" "}
          <span
            className="italic text-[27px] text-coral-600 dark:text-amber-400"
            style={{ fontFamily: "var(--font-script)" }}
          >
            parcel
          </span>
        </h3>
        <p className="font-serif italic text-[13px] text-brown-400 dark:text-amber-100/40 mt-0.5">
          {items.reduce((s, i) => s + i.quantity, 0)} item
          {items.reduce((s, i) => s + i.quantity, 0) !== 1 ? "s" : ""} · poured
          with care
        </p>
      </div>

      {/* Item list */}
      <div className="py-3 px-5 space-y-3">
        {items.map((item) => {
          const image = item.product.images?.[0];
          return (
            <div key={item.product.id} className="flex items-center gap-3">
              {/* Mini polaroid */}
              <div
                className="craft-polaroid flex-shrink-0"
                style={{ width: 44, padding: "3px 3px 9px" }}
              >
                <div
                  className="bg-[#f5ecda] dark:bg-amber-950/60 overflow-hidden"
                  style={{ width: 38, height: 38 }}
                >
                  {image ? (
                    image.match(/\.(mp4|webm|ogg)(\?.*)?$/i) ? (
                      <video
                        src={image}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    )
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-amber-600 dark:text-amber-400">
                      <Gift size={20} />
                    </div>
                  )}
                </div>
                {/* qty bubble */}
                <div className="font-sans text-[9px] font-bold absolute -top-2 -right-2 w-4 h-4 rounded-full bg-coral-600 text-white flex items-center justify-center">
                  {item.quantity}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="ah-body font-serif text-[14px] font-bold text-brown-900 dark:text-amber-100 line-clamp-1">
                  {item.product.name}
                </p>
                <p className="font-serif italic text-[12px] text-brown-400 dark:text-amber-100/40 mt-0.5">
                  qty: {item.quantity}
                </p>
              </div>
              <p className="ah-body font-serif text-[14px] font-bold text-brown-900 dark:text-amber-100 shrink-0">
                {formatPrice(
                  (item.price ?? item.product.price) * item.quantity,
                )}
              </p>
            </div>
          );
        })}
      </div>

      {/* Totals */}
      <div className="pt-3 pb-1 px-5 space-y-2">
        <div className="font-serif text-[14px] flex items-baseline">
          <span className="text-brown-600 dark:text-amber-100/60">
            Subtotal
          </span>
          <span className="craft-dot-line" />
          <span className="font-bold text-brown-900 dark:text-amber-100">
            {formatPrice(subtotal)}
          </span>
        </div>
        {discount > 0 && (
          <div className="font-serif text-[14px] flex items-baseline">
            <span className="text-coral-700 dark:text-coral-400">
              {discountCode} <span className="italic text-[11px]">off</span>
            </span>
            <span
              className="craft-dot-line"
              style={{ borderColor: "rgba(232,93,74,0.25)" }}
            />
            <span className="font-bold text-coral-700 dark:text-coral-400">
              −{formatPrice(discount)}
            </span>
          </div>
        )}
        <div className="font-serif text-[14px] flex items-baseline">
          <span className="text-brown-600 dark:text-amber-100/60">
            Shipping
          </span>
          <span className="craft-dot-line" />
          {shipping === 0 ? (
            <span
              className="text-[15px] font-semibold text-forest-600 dark:text-forest-400"
              style={{ fontFamily: "var(--font-hand)" }}
            >
              free!
            </span>
          ) : (
            <span className="font-bold text-brown-900 dark:text-amber-100">
              {formatPrice(shipping)}
            </span>
          )}
        </div>
        {codFee > 0 && (
          <div className="font-serif text-[14px] flex items-baseline">
            <span className="text-brown-600 dark:text-amber-100/60">
              Cash on Delivery
            </span>
            <span className="craft-dot-line" />
            <span className="font-bold text-brown-900 dark:text-amber-100">
              {formatPrice(codFee)}
            </span>
          </div>
        )}
        {giftWrapFee > 0 && (
          <div className="font-serif text-[14px] flex items-baseline">
            <span className="text-brown-600 dark:text-amber-100/60">
              Gift Wrap
            </span>
            <span className="craft-dot-line" />
            <span className="font-bold text-brown-900 dark:text-amber-100">
              {formatPrice(giftWrapFee)}
            </span>
          </div>
        )}
        {greetingCardFee > 0 && (
          <div className="font-serif text-[14px] flex items-baseline">
            <span className="text-brown-600 dark:text-amber-100/60">
              Greeting Card
            </span>
            <span className="craft-dot-line" />
            <span className="font-bold text-brown-900 dark:text-amber-100">
              {formatPrice(greetingCardFee)}
            </span>
          </div>
        )}
      </div>

      {/* Grand total */}
      <div className="flex items-baseline justify-between px-5 pt-3 pb-5 border-t border-brown-900/20 dark:border-amber-100/10 mt-2">
        <span className="font-sans text-[11px] tracking-[0.2em] text-gold-600 dark:text-amber-500 font-bold uppercase">
          total · INR
        </span>
        <span className="ah-display-lg text-[30px] font-black text-brown-900 dark:text-amber-50 leading-none">
          {formatPrice(total)}
        </span>
      </div>
    </div>
  );
}

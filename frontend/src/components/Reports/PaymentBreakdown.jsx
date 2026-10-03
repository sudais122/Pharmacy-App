import React from "react";
import {
  Banknote,
  CreditCard,
  Smartphone,
  Building2,
  Wallet,
} from "lucide-react";

const PaymentBreakdown = () => {
  // Dummy data for UI
  // Later this will come from reportSummary.paymentBreakdown

  const paymentData = [
    {
      name: "Cash",
      value: 11656,
      icon: Banknote,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      name: "Bank Transfer",
      value: 2200,
      icon: Building2,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      name: "EasyPaisa",
      value: 0,
      icon: Smartphone,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      name: "JazzCash",
      value: 0,
      icon: CreditCard,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
    {
      name: "Other",
      value: 0,
      icon: Wallet,
      iconBg: "bg-gray-100",
      iconColor: "text-gray-600",
    },
  ];

  const total = paymentData.reduce(
    (sum, payment) => sum + payment.value,
    0
  );

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      {/* Header */}
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-gray-900">
          Payment Breakdown
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Sales grouped by payment method.
        </p>
      </div>

      {/* Total */}
      <div className="mb-5 rounded-lg bg-gray-50 p-4">
        <p className="text-sm text-gray-500">Total Payments</p>

        <p className="mt-1 text-2xl font-bold text-gray-900">
          PKR {total.toLocaleString()}
        </p>
      </div>

      {/* Payment Methods */}
      <div className="space-y-3">
        {paymentData.map((payment) => {
          const Icon = payment.icon;

          const percentage =
            total > 0 ? (payment.value / total) * 100 : 0;

          return (
            <div key={payment.name}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`rounded-lg p-2 ${payment.iconBg}`}
                  >
                    <Icon
                      className={`h-4 w-4 ${payment.iconColor}`}
                    />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {payment.name}
                    </p>

                    <p className="text-xs text-gray-500">
                      {percentage.toFixed(1)}%
                    </p>
                  </div>
                </div>

                <p className="text-sm font-semibold text-gray-900">
                  PKR {payment.value.toLocaleString()}
                </p>
              </div>

              {/* Progress */}
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-green-500 transition-all"
                  style={{
                    width: `${percentage}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PaymentBreakdown;
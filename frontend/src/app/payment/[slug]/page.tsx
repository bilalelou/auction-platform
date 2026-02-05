"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { getPaymentInfo, processPayment, type PaymentInfo, type PaymentResult } from "@/lib/paymentApi";

type PaymentMethod = "paypal" | "card" | "cod";

export default function PaymentPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const router = useRouter();

    const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
    const [processing, setProcessing] = useState(false);
    const [result, setResult] = useState<{ data: PaymentResult; message: string } | null>(null);

    // Card form
    const [cardNumber, setCardNumber] = useState("");
    const [cardExpiry, setCardExpiry] = useState("");
    const [cardCvv, setCardCvv] = useState("");

    useEffect(() => {
        async function fetchPaymentInfo() {
            try {
                const info = await getPaymentInfo(slug);
                setPaymentInfo(info);
            } catch (err) {
                setError(err instanceof Error ? err.message : "خطأ في تحميل معلومات الدفع");
            } finally {
                setLoading(false);
            }
        }
        fetchPaymentInfo();
    }, [slug]);

    const formatPrice = (cents: number, currency: string) => {
        return `${(cents / 100).toFixed(2)} ${currency}`;
    };

    const handlePayment = async () => {
        if (!paymentInfo || !selectedMethod) return;

        setProcessing(true);
        setError(null);

        try {
            const response = await processPayment({
                product_id: paymentInfo.product.id,
                bid_id: paymentInfo.winning_bid.id,
                payment_method: selectedMethod,
                ...(selectedMethod === "card" && {
                    card_number: cardNumber,
                    card_expiry: cardExpiry,
                    card_cvv: cardCvv,
                }),
            });
            setResult(response);
        } catch (err) {
            setError(err instanceof Error ? err.message : "خطأ في معالجة الدفع");
        } finally {
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error && !paymentInfo) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-md text-center">
                    <div className="text-red-500 text-5xl mb-4">❌</div>
                    <h1 className="text-xl font-bold text-gray-800 mb-2">خطأ</h1>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={() => router.push("/")}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                    >
                        العودة للرئيسية
                    </button>
                </div>
            </div>
        );
    }

    if (result) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
                    <div className="text-green-500 text-6xl mb-4">✅</div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">تم بنجاح!</h1>
                    <p className="text-gray-600 mb-4">{result.message}</p>
                    <div className="bg-gray-50 p-4 rounded-lg mb-6 text-right">
                        <p className="text-sm text-gray-500">رقم العملية</p>
                        <p className="font-mono text-gray-800">{result.data.transaction_id}</p>
                        <p className="text-sm text-gray-500 mt-2">المبلغ</p>
                        <p className="font-bold text-green-600">{formatPrice(result.data.amount_cents, result.data.currency)}</p>
                    </div>
                    <button
                        onClick={() => router.push("/")}
                        className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        العودة للرئيسية
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">إتمام الدفع</h1>

                {/* Product Summary */}
                {paymentInfo && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <div className="flex gap-4 items-start">
                            {paymentInfo.product.image_url && (
                                <img
                                    src={paymentInfo.product.image_url}
                                    alt={paymentInfo.product.name}
                                    className="w-24 h-24 object-cover rounded-lg"
                                />
                            )}
                            <div className="flex-1">
                                <h2 className="text-xl font-semibold text-gray-800">{paymentInfo.product.name}</h2>
                                <p className="text-gray-500 text-sm">العرض الفائز</p>
                                <p className="text-2xl font-bold text-green-600 mt-2">
                                    {formatPrice(paymentInfo.winning_bid.amount_cents, paymentInfo.winning_bid.currency)}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Payment Methods */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">اختر طريقة الدفع</h2>

                    <div className="space-y-4">
                        {/* PayPal */}
                        <label
                            className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-colors ${selectedMethod === "paypal" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                                }`}
                        >
                            <input
                                type="radio"
                                name="payment_method"
                                value="paypal"
                                checked={selectedMethod === "paypal"}
                                onChange={() => setSelectedMethod("paypal")}
                                className="w-5 h-5 text-blue-600"
                            />
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl">💳</span>
                                    <span className="font-semibold text-gray-800">PayPal</span>
                                </div>
                                <p className="text-sm text-gray-500">ادفع بأمان عبر حسابك في PayPal</p>
                            </div>
                            <div className="text-blue-600 font-bold">PayPal</div>
                        </label>

                        {/* Credit Card */}
                        <label
                            className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-colors ${selectedMethod === "card" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                                }`}
                        >
                            <input
                                type="radio"
                                name="payment_method"
                                value="card"
                                checked={selectedMethod === "card"}
                                onChange={() => setSelectedMethod("card")}
                                className="w-5 h-5 text-blue-600"
                            />
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl">💳</span>
                                    <span className="font-semibold text-gray-800">بطاقة بنكية</span>
                                </div>
                                <p className="text-sm text-gray-500">Visa, Mastercard, أو بطاقات أخرى</p>
                            </div>
                            <div className="flex gap-1">
                                <span className="text-xl">💳</span>
                            </div>
                        </label>

                        {/* Cash on Delivery */}
                        <label
                            className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-colors ${selectedMethod === "cod" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                                }`}
                        >
                            <input
                                type="radio"
                                name="payment_method"
                                value="cod"
                                checked={selectedMethod === "cod"}
                                onChange={() => setSelectedMethod("cod")}
                                className="w-5 h-5 text-blue-600"
                            />
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl">📦</span>
                                    <span className="font-semibold text-gray-800">الدفع عند الاستلام</span>
                                </div>
                                <p className="text-sm text-gray-500">ادفع نقداً عند استلام المنتج</p>
                            </div>
                            <div className="text-green-600 font-bold">COD</div>
                        </label>
                    </div>
                </div>

                {/* Card Form (only if card selected) */}
                {selectedMethod === "card" && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h2 className="text-xl font-semibold mb-4">معلومات البطاقة</h2>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                                    رقم البطاقة
                                </label>
                                <input
                                    id="cardNumber"
                                    type="text"
                                    value={cardNumber}
                                    onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, "").slice(0, 16))}
                                    placeholder="1234 5678 9012 3456"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="cardExpiry" className="block text-sm font-medium text-gray-700 mb-1">
                                        تاريخ الانتهاء
                                    </label>
                                    <input
                                        id="cardExpiry"
                                        type="text"
                                        value={cardExpiry}
                                        onChange={(e) => setCardExpiry(e.target.value.slice(0, 5))}
                                        placeholder="MM/YY"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="cardCvv" className="block text-sm font-medium text-gray-700 mb-1">
                                        CVV
                                    </label>
                                    <input
                                        id="cardCvv"
                                        type="text"
                                        value={cardCvv}
                                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                                        placeholder="123"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {/* Submit Button */}
                <button
                    onClick={handlePayment}
                    disabled={!selectedMethod || processing}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                >
                    {processing ? (
                        <span className="flex items-center justify-center gap-2">
                            <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                            جاري المعالجة...
                        </span>
                    ) : paymentInfo ? (
                        `إتمام الدفع - ${formatPrice(paymentInfo.winning_bid.amount_cents, paymentInfo.winning_bid.currency)}`
                    ) : (
                        "إتمام الدفع"
                    )}
                </button>

                {/* Back button */}
                <button
                    onClick={() => router.back()}
                    className="w-full mt-4 text-gray-600 hover:text-gray-800 py-2"
                >
                    ← العودة
                </button>
            </div>
        </div>
    );
}

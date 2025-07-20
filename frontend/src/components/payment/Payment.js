"use client";
import React, { useRef } from "react";
import GooglePayButton from "@google-pay/button-react";

const Payment = ({ data, isPaid, onResponse }) => {
	const gPayBtnRef = useRef(0);
	const { total } = data;

	if (!total || total >= 99999) {
		alert(
			"Orders above ₹99,999 are not supported. Please adjust your order to continue.",
		);
		return null;
	}

	return (
		<GooglePayButton
			environment='TEST'
			ref={gPayBtnRef}
			buttonColor='black'
			buttonType='buy'
			buttonRadius='100'
			buttonLocale='en'
			buttonSizeMode='fill'
			paymentRequest={{
				apiVersion: 2,
				apiVersionMinor: 0,
				allowedPaymentMethods: [
					{
						type: "CARD",
						parameters: {
							allowedAuthMethods: [
								"PAN_ONLY",
								"CRYPTOGRAM_3DS",
							],
							allowedCardNetworks: [
								"MASTERCARD",
								"VISA",
							],
						},
						tokenizationSpecification: {
							type: "PAYMENT_GATEWAY",
							parameters: {
								gateway: "example",
								gatewayMerchantId:
									"exampleGatewayMerchantId",
							},
						},
					},
				],
				merchantInfo: {
					merchantId: `${process.env.NEXT_PUBLIC_GPAY_MERCHANT_ID}`,
					merchantName: `${process.env.NEXT_PUBLIC_GPAY_MERCHANT_NAME}`,
				},
				transactionInfo: {
					totalPriceStatus: "FINAL",
					totalPrice: `${total}`,
					currencyCode: "INR",
				},
			}}
			onLoadPaymentData={(paymentData) => {
				onResponse && onResponse(paymentData);
			}}
		/>
	);
};

export default Payment;

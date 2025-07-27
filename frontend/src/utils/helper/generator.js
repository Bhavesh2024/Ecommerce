export const generateMessage = (type, user, messageType) => {
	if (type == "request") {
		return `${user} has request ${messageType.toLowerCase()}`;
	}
	if (type == "notification") {
	}
};

export const generateOTP = (length = 6) => {
	let otp = "";
	for (let i = 0; i < length; i++) {
		otp += Math.floor(Math.random() * 10); // Digits 0-9
	}
	return otp;
};
export const generateOrderSummaryHTML = (order, productName = "") => {
	const { variants, extras, totals, quantity } = order;

	let summaryHTML = `<div style="margin-top:15px;">
		<h3 style="color:#7c3aed; font-size:16px; margin-bottom:8px;">Order Summary</h3>
		<div style="background:#f3e8ff; border:1px dashed #7c3aed; border-radius:6px; padding:12px;">
			<table style="width:100%; font-size:14px; color:#374151;">`;

	// Product or Variants
	if (variants && variants.length > 0) {
		variants.forEach((variant) => {
			summaryHTML += `
			<tr>
				<td style="padding:6px 0; font-weight:500;">${variant.label} 
					<span style="color:#9ca3af;">(${variant.quantity}×)</span>
				</td>
				<td style="padding:6px 0; font-weight:500; text-align:right;">₹${variant.value.toFixed(
					2,
				)}</td>
			</tr>`;
		});
	} else if (productName) {
		summaryHTML += `
		<tr>
			<td style="padding:6px 0; font-weight:500;">${productName}</td>
			<td style="padding:6px 0; font-weight:500; text-align:right;">₹${totals.variantTotal.toFixed(
				2,
			)}</td>
		</tr>`;
	}

	summaryHTML += `</table></div></div>`;

	// Extras if exist
	if (extras && extras.length > 0) {
		summaryHTML += `
		<div style="margin-top:15px;">
			<h3 style="color:#7c3aed; font-size:16px; margin-bottom:8px;">Extras</h3>
			<div style="background:#f3e8ff; border:1px dashed #7c3aed; border-radius:6px; padding:12px;">
				<table style="width:100%; font-size:14px; color:#374151;">`;

		extras.forEach((extra) => {
			summaryHTML += `
			<tr>
				<td style="padding:6px 0; font-weight:500;">${extra.name}</td>
				<td style="padding:6px 0; font-weight:500; text-align:right;">₹${extra.price.toFixed(
					2,
				)}</td>
			</tr>`;
		});

		summaryHTML += `</table></div></div>`;
	}

	// Billing Summary
	summaryHTML += `
	<div style="margin-top:15px;">
		<h3 style="color:#7c3aed; font-size:16px; margin-bottom:8px;">Billing Summary</h3>
		<div style="background:#f3e8ff; border:1px dashed #7c3aed; border-radius:6px; padding:12px;">
			<table style="width:100%; font-size:14px; color:#374151;">
				<tr>
					<td style="padding:6px 0; font-weight:500;">Subtotal</td>
					<td style="padding:6px 0; font-weight:500; text-align:right;">₹${totals.variantTotal.toFixed(
						2,
					)}</td>
				</tr>
				<tr>
					<td style="padding:6px 0; font-weight:500;">Extras</td>
					<td style="padding:6px 0; font-weight:500; text-align:right;">₹${totals.extrasTotal.toFixed(
						2,
					)}</td>
				</tr>
				<tr>
					<td style="padding:6px 0; font-weight:500;">Discount</td>
					<td style="padding:6px 0; font-weight:500; text-align:right;">₹${totals.discountAmount.toFixed(
						2,
					)}</td>
				</tr>
				<tr>
					<td style="padding:6px 0; font-weight:500;">Bundle</td>
					<td style="padding:6px 0; font-weight:500; text-align:right;">${quantity}</td>
				</tr>
				<tr>
					<td style="padding:10px 0; font-size:15px; font-weight:bold; color:#7c3aed;">Total</td>
					<td style="padding:10px 0; font-size:15px; font-weight:bold; color:#7c3aed; text-align:right;">₹${(
						totals.total * quantity
					).toFixed(2)}</td>
				</tr>
			</table>
		</div>
	</div>`;

	return summaryHTML;
};

export const generateOptimizedUrl = (url, width = "w_400") => {
	if (!url) return "";
	if (url.includes("res.cloudinary.com")) {
		// Automatically optimize with quality and format
		const hasParams = url.includes("?");
		return `${url}${hasParams ? "&" : "?"}q_auto,f_auto,${width}`;
	}
	return url;
};

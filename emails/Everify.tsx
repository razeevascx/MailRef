import {
	Body,
	Container,
	Head,
	Heading,
	Html,
	Preview,
	Section,
	Text,
} from "@react-email/components";
import * as React from "react";

interface SupaAuthVerifyEmailProp {
	verificationCode?: string;
}

const generateVerificationCode = () => {
	return Math.floor(100000 + Math.random() * 900000).toString();
};

export default function SupaAuthVerifyEmail({
	verificationCode = generateVerificationCode(),
}: SupaAuthVerifyEmailProp) {
	return (
		<Html>
			<Head />
			<Preview>Supauth Email Verification</Preview>
			<Body className="bg-white text-gray-900">
				<Container className="p-5 mx-auto bg-gray-200">
					<Section className="bg-white">
						<Section className="bg-gray-800 flex py-5 items-center justify-center"></Section>
						<Section className="p-6">
							<Heading className="text-gray-800 font-bold text-xl mb-4">
								SupaAuth Verify your email address
							</Heading>
							<Text className="text-gray-800 text-base mb-6">
								{
									"Thanks for starting the new account creation process. We want to make sure it's really you. Please enter the following verification code when prompted. If you don&apos;t want to create an account, you can ignore this message."
								}
							</Text>
							<Section className="flex items-center justify-center">
								<Text className="text-gray-800 text-base font-bold text-center m-0">
									Verification code
								</Text>

								<Text className="text-gray-800 text-4xl font-bold my-2 text-center">
									{verificationCode}
								</Text>
								<Text className="text-gray-800 text-base text-center m-0">
									(This code is valid for 1 hour)
								</Text>
							</Section>
						</Section>
					</Section>
				</Container>
			</Body>
		</Html>
	);
}

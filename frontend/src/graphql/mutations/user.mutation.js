import { gql } from "@apollo/client";

export const SIGN_UP = gql`
	mutation Signup($input: signUpInput!) {
		signup(input: $input) {
			_id
			name
			username
		}
	}
`;

export const LOGIN = gql`
	mutation Login($input: LoginInput!) {
		Login(input: $input) {
			_id
			name
			username
		}
	}
`;

export const LOGOUT = gql`
	mutation Logout {
		logout {
			message
		}
	}
`;
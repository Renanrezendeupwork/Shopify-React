import {
  json,
  redirect,
  type ActionFunction,
  type AppLoadContext,
  type LoaderArgs,
} from '@shopify/remix-oxygen';
import {
  Form,
  useActionData,
  useLoaderData,
  type V2_MetaFunction,
} from '@remix-run/react';
import {useState} from 'react';

import {getInputStyleClasses} from '~/lib/utils';
import {Link} from '~/components';

export const handle = {
  isPublic: true,
};

export async function loader({context, params}: LoaderArgs) {
  const customerAccessToken = await context.session.get('customerAccessToken');

  if (customerAccessToken) {
    return redirect(params.locale ? `${params.locale}/account` : '/account');
  }

  // TODO: Query for this?
  return json({shopName: 'Hydrogen'});
}

type ActionData = {
  formError?: string;
};

const badRequest = (data: ActionData) => json(data, {status: 400});

export const action: ActionFunction = async ({request, context, params}) => {
  const formData = await request.formData();

  const email = formData.get('email');
  const password = formData.get('password');

  if (
    !email ||
    !password ||
    typeof email !== 'string' ||
    typeof password !== 'string'
  ) {
    return badRequest({
      formError: 'Please provide both an email and a password.',
    });
  }

  const {session, storefront} = context;

  try {
    const customerAccessToken = await doLogin(context, {email, password});
    session.set('customerAccessToken', customerAccessToken);

    return redirect(params.locale ? `/${params.locale}/account` : '/account', {
      headers: {
        'Set-Cookie': await session.commit(),
      },
    });
  } catch (error: any) {
    if (storefront.isApiError(error)) {
      return badRequest({
        formError: 'Something went wrong. Please try again later.',
      });
    }

    /**
     * The user did something wrong, but the raw error from the API is not super friendly.
     * Let's make one up.
     */
    return badRequest({
      formError:
        'Sorry. We did not recognize either your email or password. Please try to sign in again or create a new account.',
    });
  }
};

export const meta: V2_MetaFunction = () => {
  return [{title: 'Login'}];
};

export default function LoginRegister(params:type) {
  return (
    <div className='px-12 lg:px-0 pb-8 lg:pb-[16rem]'>
      <div className="max-w-[76.5rem] mx-auto">
        <div className="my-12 lg:my-24">
          <Link to="/collections/all" className="text-[#607d80] text-base tracking-[0.15rem] uppercase underline">Back to shop</Link>	
        </div>

        <div className='lg:flex justify-center relative'>
          <div className='bg-[#e0e0e0] hidden lg:block w-[1px] h-[20rem] absolute top-0 left-1/2 -translate-x-1/2'></div>
          <Login />
          <Register />
        </div>
      </div>

      <div className='w-[70%] mx-auto border mt-28 lg:mt-6 p-16 border-[#ddd]'>
        <Text />
      </div>
    </div>
  ) 
}

function Text() {
  return (
    <> 
      <div className='text-center mb-16'>
        <h3 className='text-[2.56rem] mt-2 mb-8'>Re-Ligne</h3>
        <p>A peer-to-peer resale marketplace for the lines you've loved.</p>
      </div>
      <div className='lg:flex justify-center text-center'>
        <div className="mb-[10%] lg:mb-0 lg:pr-16">
          <h4 className='font-bold'>Login</h4>
          <p className='text-fine mt-2 mb-8'>Use your email to create an account and login.</p>
        </div>

        <div className="mb-[10%] lg:mb-0 lg:pr-16">
          <h4 className='font-bold'>List your item</h4>
          <p className='text-fine mt-2 mb-8'>Upload images and provide a brief description.</p>
        </div>

        <div className="mb-[10%] lg:mb-0 lg:pr-16">
          <h4 className='font-bold'>Prepare to ship</h4>
          <p className='text-fine mt-2 mb-8'>When it sells, send your piece with our pre-paid label.</p>
        </div>
      </div>
    </>
  )
}

export function Login() {
  const {shopName} = useLoaderData<typeof loader>();
  const actionData = useActionData<ActionData>();
  const [nativeEmailError, setNativeEmailError] = useState<null | string>(null);
  const [nativePasswordError, setNativePasswordError] = useState<null | string>(
    null,
  );
  
  const [isOpenRecover, setIsOpenRecover] = useState(false);

  return (
    <div className="lg:w-1/2 w-full lg:pr-[10.6rem]">
      <div className={`${isOpenRecover ? 'hidden' : 'block '}`}>
        <h1 className="text-[2.48rem] lg:text-[3.2rem] mt-2 mb-8">Log In</h1>
        {/* TODO: Add onSubmit to validate _before_ submission with native? */}
        <Form
          method="post"
          noValidate
          className="lg:pt-6 pb-20 lg:pb-8 lg:mt-4 mb-4 space-y-8"
        >
          {actionData?.formError && (
            <div className="flex items-center justify-center mb-6 bg-zinc-500">
              <p className="m-4 text-s text-contrast">{actionData.formError}</p>
            </div>
          )}
          <div>
            <input
              className={`h-16	${getInputStyleClasses(nativeEmailError)}`}
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="Email"
              aria-label="Email"
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              onBlur={(event) => {
                setNativeEmailError(
                  event.currentTarget.value.length &&
                    !event.currentTarget.validity.valid
                    ? 'Invalid email address'
                    : null,
                );
              }}
            />
            {nativeEmailError && (
              <p className="text-red-500 text-xs">{nativeEmailError} &nbsp;</p>
            )}
          </div>

          <div>
            <input
              className={`h-16 ${getInputStyleClasses(nativePasswordError)}`}
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Password"
              aria-label="Password"
              minLength={8}
              required
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              onBlur={(event) => {
                if (
                  event.currentTarget.validity.valid ||
                  !event.currentTarget.value.length
                ) {
                  setNativePasswordError(null);
                } else {
                  setNativePasswordError(
                    event.currentTarget.validity.valueMissing
                      ? 'Please enter a password'
                      : 'Passwords must be at least 8 characters',
                  );
                }
              }}
            />
            {nativePasswordError && (
              <p className="text-red-500 text-xs">
                {' '}
                {nativePasswordError} &nbsp;
              </p>
            )}
          </div>
          <div className="items-center justify-between text-center">
            <button
              className="bg-primary text-contrast py-4 mb-4 px-4 focus:shadow-outline block w-full"
              type="submit"
              disabled={!!(nativePasswordError || nativeEmailError)}
            >
              Sign in
            </button>
            <div onClick={() => {setIsOpenRecover(true)}}
              className="text-base tracking-[0.15rem] cursor-pointer uppercase underline text-[#607d80]"
            >
              Forgot your password?
            </div>
          </div>
        </Form>
      </div>

      {isOpenRecover && (
        <>
          <Recover setIsOpenRecover={setIsOpenRecover} />
          <div onClick={() => {setIsOpenRecover(false)}}
              className="text-base text-center cursor-pointer tracking-[0.15rem] uppercase underline"
            >
            Cancel
          </div>
        </>
      )}
    </div>
  );
}

export async function doLogin(
  {storefront}: AppLoadContext,
  {
    email,
    password,
  }: {
    email: string;
    password: string;
  },
) {
  const data = await storefront.mutate(LOGIN_MUTATION, {
    variables: {
      input: {
        email,
        password,
      },
    },
  });

  if (data?.customerAccessTokenCreate?.customerAccessToken?.accessToken) {
    return data.customerAccessTokenCreate.customerAccessToken.accessToken;
  }

  /**
   * Something is wrong with the user's input.
   */
  throw new Error(
    data?.customerAccessTokenCreate?.customerUserErrors.join(', '),
  );
}

export function Register() {
  const actionData = useActionData<ActionData>();
  const [nativeEmailError, setNativeEmailError] = useState<null | string>(null);
  const [nativePasswordError, setNativePasswordError] = useState<null | string>(
    null,
  );

  return (
    <div className="lg:w-1/2 w-full lg:pl-[10.6rem]">
      <h1 className="text-[2.48rem] lgtext-[3.2rem] mt-2 mb-8">Line Up</h1>
      {/* TODO: Add onSubmit to validate _before_ submission with native? */}
      <Form
        method="post"
        noValidate
        action='/account/register'
        className="lg:pt-6 pb-8 lg:mt-4 mb-4 space-y-8"
      >
        {actionData?.formError && (
          <div className="flex items-center justify-center mb-6 bg-zinc-500">
            <p className="m-4 text-s text-contrast">{actionData.formError}</p>
          </div>
        )}
         <div>
         <input
            className={`h-16 ${getInputStyleClasses(nativeEmailError)}`}
            id="first-name"
            name="first_name"
            type="text"
            autoComplete="First name"
            required
            placeholder="First name"
            aria-label="First name"
            autoFocus
          />
        </div>
        <div>
          <input
            className={`h-16 ${getInputStyleClasses(nativeEmailError)}`}
            id="last-name"
            name="last_name"
            type="text"
            autoComplete="Last name"
            required
            placeholder="Last name"
            aria-label="Last name"
            autoFocus
          />
        </div>
        <div>
          <input
            className={`h-16 ${getInputStyleClasses(nativeEmailError)}`}
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="Email"
            aria-label="Email"
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
            onBlur={(event) => {
              setNativeEmailError(
                event.currentTarget.value.length &&
                  !event.currentTarget.validity.valid
                  ? 'Invalid email address'
                  : null,
              );
            }}
          />
          {nativeEmailError && (
            <p className="text-red-500 text-xs">{nativeEmailError} &nbsp;</p>
          )}
        </div>
        <div>
          <input
            className={`h-16 ${getInputStyleClasses(nativePasswordError)}`}
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="Password"
            aria-label="Password"
            minLength={8}
            required
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
            onBlur={(event) => {
              if (
                event.currentTarget.validity.valid ||
                !event.currentTarget.value.length
              ) {
                setNativePasswordError(null);
              } else {
                setNativePasswordError(
                  event.currentTarget.validity.valueMissing
                    ? 'Please enter a password'
                    : 'Passwords must be at least 8 characters',
                );
              }
            }}
          />
          {nativePasswordError && (
            <p className="text-red-500 text-xs">
              {' '}
              {nativePasswordError} &nbsp;
            </p>
          )}
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-primary text-contrast rounded py-4 px-4 focus:shadow-outline block w-full"
            type="submit"
            disabled={!!(nativePasswordError || nativeEmailError)}
          >
            Sign up
          </button>
        </div>
      </Form>
    </div>
  );
}

export function Recover() {
  const actionData = useActionData<ActionData>();
  const [nativeEmailError, setNativeEmailError] = useState<null | string>(null);
  const isSubmitted = actionData?.resetRequested;

  return (
    <div className="flex justify-center mb-24 lg:mb-0">
      <div className="w-full">
        {isSubmitted ? (
          <>
            <h1 className="text-[2.48rem] lg:text-[3.2rem]">Request Sent.</h1>
            <p className="mt-4">
              If that email address is in our system, you will receive an email
              with instructions about how to reset your password in a few
              minutes.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-[2.48rem] lg:text-[3.2rem]">Happens to Everyone</h1>
            <p className="mt-4">
               Enter your new password and we'll sort it out.
            </p>
            {/* TODO: Add onSubmit to validate _before_ submission with native? */}
            <Form
              method="post"
              action='/account/recover'
              noValidate
              className="pt-6 mt-4 space-y-8"
            >
              {actionData?.formError && (
                <div className="flex items-center justify-center mb-6 bg-zinc-500">
                  <p className="m-4 text-s text-contrast">
                    {actionData.formError}
                  </p>
                </div>
              )}
              <div>
                <input
                  className={`h-16 ${getInputStyleClasses(nativeEmailError)}`}
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="Email address"
                  aria-label="Email address"
                  // eslint-disable-next-line jsx-a11y/no-autofocus
                  autoFocus
                  onBlur={(event) => {
                    setNativeEmailError(
                      event.currentTarget.value.length &&
                        !event.currentTarget.validity.valid
                        ? 'Invalid email address'
                        : null,
                    );
                  }}
                />
                {nativeEmailError && (
                  <p className="text-red-500 text-xs">
                    {nativeEmailError} &nbsp;
                  </p>
                )}
              </div>
              <div className="text-center">
                <button
                  className="bg-primary text-contrast py-4 mb-4 px-4 focus:shadow-outline block w-full"
                  type="submit"
                >
                  Send Reset Instructions
                </button>
              </div>
            </Form>
          </>
        )}
      </div>
    </div>
  );
}

const CUSTOMER_RECOVER_MUTATION = `#graphql
  mutation customerRecover($email: String!) {
    customerRecover(email: $email) {
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

const CUSTOMER_CREATE_MUTATION = `#graphql
  mutation customerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        id
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;


const LOGIN_MUTATION = `#graphql
  mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerUserErrors {
        code
        field
        message
      }
      customerAccessToken {
        accessToken
        expiresAt
      }
    }
  }
`;

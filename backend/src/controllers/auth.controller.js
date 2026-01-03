import logger from '#config/logger.js';
import { signupSchema, signInSchema } from '#validations/auth.validation.js';
import { formatValidationError } from '#utils/format.js';
import { createUser, authenticateUser } from '#services/auth.service.js';
import { jwttoken } from '#utils/jwt.js';
import { cookies } from '#utils/cookies.js';

// Handles user registration: validates input, creates a user, issues a JWT, and sets a login cookie
export const signUp = async (req, res, next) => {
  try {
    // Validate the request body using the signup schema
    const validationResult = signupSchema.safeParse(req.body);

    // If validation fails, return a 400 error with readable validation details
    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationError(validationResult.error),
      });
    }

    // Extract the validated user data
    const { name, email, password, role } = validationResult.data;

    // Create the user in the database
    const user = await createUser({ name, email, password, role });

    // Generate a JWT containing the user's identity and role
    const token = jwttoken.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    // Store the JWT in a secure, HTTP-only cookie
    cookies.set(res, 'token', token);

    // Log successful registration for monitoring and debugging
    logger.info(`User registered successfully: ${email}`);

    // Send a success response with non-sensitive user information
    res.status(201).json({
      message: 'User registered',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (e) {
    // Log any unexpected errors during signup
    logger.error('Signup error', e);

    // Handle the specific case where the email already exists
    if (e.message === 'User with this email already exists') {
      return res.status(409).json({ error: 'Email already exist' });
    }

    // Pass all other errors to the global error handler
    next(e);
  }
};

export const signIn = async (req, res, next) => {
  try {
    const validationResult = signInSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationError(validationResult.error),
      });
    }

    const { email, password } = validationResult.data;

    const user = await authenticateUser({ email, password });

    const token = jwttoken.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    cookies.set(res, 'token', token);

    logger.info(`User signed in successfully: ${email}`);
    res.status(200).json({
      message: 'User signed in successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (e) {
    logger.error('Sign in error', e);

    if (e.message === 'User not found' || e.message === 'Invalid password') {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    next(e);
  }
};

export const signOut = async (req, res, next) => {
  try {
    cookies.clear(res, 'token');

    logger.info('User signed out successfully');
    res.status(200).json({
      message: 'User signed out successfully',
    });
  } catch (e) {
    logger.error('Sign out error', e);
    next(e);
  }
};

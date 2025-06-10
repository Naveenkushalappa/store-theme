import React, { useState, useRef } from "react"
import { useMutation } from 'react-apollo'
import { ApolloError } from 'apollo-client'
import ADD_DOCUMENT from '../../graphql/addDocument.gql'

import styles from './index.css'
import ReCAPTCHA from 'react-google-recaptcha'

const StoreContact = () => {
    //todo: get the site key from the settings
    const RECAPTCHA_SITE_KEY = '6LdNWVsrAAAAAO82YrNvWPyy_aPFi4z_njsG2MWC'

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [location, setLocation] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

    const recaptcha = useRef<ReCAPTCHA>(null)

    const [addDocument, { loading, error, data }] = useMutation(ADD_DOCUMENT, {
        onError: (error: ApolloError) => {
            console.error('Mutation error details:', {
                message: error.message,
                graphQLErrors: error.graphQLErrors?.map(err => ({
                    message: err.message,
                    path: err.path,
                    extensions: err.extensions
                })),
                networkError: error.networkError
            });
            setSubmitError(error.message);
        },
        onCompleted: (data) => {
            clearForm();
            setSubmitSuccess('Form submitted successfully!!!');
        }
    });

    const clearForm = () => {
        setFirstName('');
        setLastName('');
        setContactNumber('');
        setLocation('');
        setFile(null);
        setSubmitError(null);
        setSubmitSuccess(null);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitError(null);

        const captchaValue = recaptcha.current?.getValue()

        if (!captchaValue) {
            alert('Please verify the reCAPTCHA!')
            return;
        }

        try {
            const response = await addDocument({
                variables: {
                    acronym: 'NC',
                    document: {
                        fields: [
                            { key: 'firstName', value: firstName },
                            { key: 'lastName', value: lastName },
                            { key: 'contactNumber', value: contactNumber },
                            { key: 'location', value: location },
                            { key: 'fileLink', value: file }
                        ]
                    }
                }
            });

            if (response && response?.data) {
                console.log('Mutation successful:', response.data);
                setSubmitSuccess('Form submitted successfully!!!!!');
            } else {
                setSubmitError('No data returned from server');
            }
        } catch (err) {
            const error = err as ApolloError;
            console.error('Submission error:', error);
            setSubmitError(error.message || 'An error occurred while submitting the form');
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFile(file);
        }
    }

    // Add error display in the UI
    React.useEffect(() => {
        if (error) {
            console.error('Apollo error state:', error);
        }
    }, [error]);

    if (typeof window === 'undefined') return null

    return (
        <div className={styles.formContainer}>
            <h3 className={styles.textXlFontBoldMb4}>Enter contact details</h3>
            {submitError && (
                <div className={styles.errorMessage}>
                    {submitError}
                </div>
            )}
            {submitSuccess && (
                <div className={styles.successMessage}>
                    {submitSuccess}
                </div>
            )}
            <div className={styles.wFull}>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label htmlFor="firstName" className={styles.label}>First Name</label>
                        <input type="text" id="firstName" placeholder="First name" required value={firstName} onChange={(e) => setFirstName(e.target.value)}
                            className="input" />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="lastName" className={styles.label}>Last Name</label>
                        <input type="text" id="lastName" placeholder="Last name" required value={lastName} onChange={(e) => setLastName(e.target.value)}
                            className="input" />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="contactNumber" className={styles.label}>Contact Number</label>
                        <input type="number" id="contactNumber" placeholder="Contact number" required value={contactNumber} onChange={(e) => setContactNumber(e.target.value)}
                            className="input" />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="location" className={styles.label}>Location</label>
                        <input type="text" id="location" placeholder="Location" required value={location} onChange={(e) => setLocation(e.target.value)} className="input" />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="file" className={styles.label}>File</label>
                        <input type="file" id="file" accept="image/jpeg, image/png" onChange={handleFileChange} className={styles.input} />
                    </div>

                    {RECAPTCHA_SITE_KEY ? (
                        <ReCAPTCHA ref={recaptcha} sitekey={RECAPTCHA_SITE_KEY} />
                    ) : (
                        <div className={styles.errorMessage}>
                            ReCAPTCHA configuration missing
                        </div>
                    )}

                    <button type="submit" disabled={loading} className={styles.button}>
                        {loading ? 'Submitting...' : 'Submit'}
                    </button>

                </form>
            </div>
        </div>
    )
}

export default StoreContact;
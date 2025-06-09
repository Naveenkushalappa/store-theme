import React, { useState } from "react"
import { useMutation } from 'react-apollo'
import { ApolloError } from 'apollo-client'
import ADD_DOCUMENT from '../../graphql/addDocument.gql'

import styles from './index.css'

interface DocumentField {
    key: string;
    value: string;
}

interface DocumentInput {
    fields: DocumentField[];
}

interface AddDocumentVariables {
    acronym: string;
    document: DocumentInput;
}


const StoreContact = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [email, setEmail] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [submitError, setSubmitError] = useState<string | null>(null);

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
        }
    });

    const clearForm = () => {
        setFirstName('');
        setLastName('');
        setEmail('');
        setContactNumber('');
        setSubject('');
        setMessage('');
        setFile(null);
        setSubmitError(null);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitError(null);

        //todo: add file upload as location.
        try {
            const response = await addDocument({
                variables: {
                    acronym: 'NC',
                    document: {
                        fields: [
                            { key: 'firstName', value: firstName },
                            { key: 'lastName', value: lastName },
                            { key: 'contactNumber', value: contactNumber },
                            { key: 'location', value: "test" }
                        ]
                    }
                }
            });
            
            if (response.data) {
                console.log('Mutation successful:', response.data);
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
                        <label htmlFor="email" className={styles.label}>Email</label>
                        <input type="email" id="email" placeholder="Email" value={email} required onChange={(e) => setEmail(e.target.value)} className="input" />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="subject" className={styles.label}>Subject</label>
                        <input type="text" id="subject" placeholder="Subject"  value={subject} onChange={(e) => setSubject(e.target.value)} className="input" />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="message" className={styles.label}>Message</label>
                        <textarea id="message" placeholder="Message" value={message} onChange={(e) => setMessage(e.target.value)} className="input" />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="file" className={styles.label}>File</label>
                        <input type="file" id="file" accept="image/jpeg, image/png" onChange={handleFileChange} className={styles.input} />
                    </div>

                    <button type="submit" disabled={loading} className={styles.button}>
                        {loading ? 'Submitting...' : 'Submit'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default StoreContact;
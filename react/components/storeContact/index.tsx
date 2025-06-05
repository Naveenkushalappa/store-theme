import React, { useState } from "react";
import styles from "./index.css";

const StoreContact = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [file, setFile] = useState<File | null>(null);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(name, email, subject, message, file);
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFile(file);
        }
    }
    return (
        <div className={styles.formContainer}>
            <h3 className="text-xl font-bold mb-4">Enter contact details</h3>
            <div className="w-full">
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label htmlFor="name" className={styles.label}>Name</label>
                        <input type="text" id="name" placeholder="Name" required value={name} onChange={(e) => setName(e.target.value)} 
                        className={styles.input} />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="email" className={styles.label}>Email</label>
                        <input type="email" id="email" placeholder="Email" value={email} required onChange={(e) => setEmail(e.target.value)} className={styles.input} />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="subject" className={styles.label}>Subject</label>
                        <input type="text" id="subject" placeholder="Subject" required value={subject} onChange={(e) => setSubject(e.target.value)} className={styles.input} />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="message" className={styles.label}>Message</label>
                        <textarea id="message" placeholder="Message" value={message} required onChange={(e) => setMessage(e.target.value)} className={styles.input} />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="file" className={styles.label}>File</label>
                        <input type="file" id="file" accept="image/jpeg, image/png" required onChange={handleFileChange} className={styles.input} />
                    </div>

                    <button type="submit" className={styles.button}>Submit</button>
                </form>
            </div>
        </div>
    )
}

export default StoreContact;
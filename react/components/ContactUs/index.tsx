import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface ContactUsProps {
    firstName: string;
    lastName: string;
    contactNumber: number;
    location: string;
}

interface ContactUsData {
    contactUsData: ContactUsProps[];
}

const ContactUsDetail = ({ firstName, lastName, contactNumber, location }: ContactUsProps) => {
    return <div>{firstName} {lastName} {contactNumber} {location}</div>
}

const ContactUsTable = ({ contactUsData }: { contactUsData: ContactUsProps[] }) => {

    return (
    <div>
        <table>
            <thead>
                <tr>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Contact Number</th>
                    <th>Location</th>
                </tr>
            </thead>
            <tbody>
                {contactUsData.map((contactUs: { firstName: string; lastName: string; contactNumber: number; location: string; }) => {
                    return <tr>
                        <td>{contactUs.firstName}</td>
                        <td>{contactUs.lastName}</td>
                        <td>{contactUs.contactNumber}</td>
                        <td>{contactUs.location}</td>
                    </tr>
                })}
            </tbody>
        </table>
    </div>
    )
}

const getContactUsData = async ({ start, end }: { start: number, end: number }, setIsPageLimitReached: (isPageLimitReached: boolean) => void) => {
    const response = await axios.get('/api/dataentities/NC/search?_size=5&_fields=_all', {
        headers: {
            'Accept': 'application/vnd.vtex.ds.v10+json',
            'Content-Type': 'application/json',
            'X-VTEX-API-AppKey': 'vtexappkey-trika-EGMFAJ',
            'X-VTEX-API-AppToken': 'PMBEGIZOAKIJMNJPTEHUEGCMEPNACEGLWWMHTWGQAAHMXWQEQDVFERPKDWXIJIRHFLHITNITFTWNTYDETOASVOWJJWEWRQMAKVSQODHHMMTAVZXBVVCLIXHAOXHZSOWB',
            'REST-Range': `resources=${start}-${end}`
        },
        baseURL: window.location.origin,
    });
    const responseRange = response.headers['rest-content-range'];
    const totalItems = responseRange.split('/')[1];
    if (totalItems <= end) {
        setIsPageLimitReached(true);
    }
    return response.data;
}
const ContactUs = ({ pageSize }: { pageSize: number }) => {
    const [contactUsData, setContactUsData] = useState<ContactUsProps[]>([]);
    const [isPageLimitReached, setIsPageLimitReached] = useState(false);
    useEffect(() => {
        getContactUsData({ start: 0, end: pageSize }, setIsPageLimitReached).then((response) => {
            setContactUsData(response);
        });
    }, [])

    const handleLoadMore = () => {
        getContactUsData({ start: contactUsData.length, end: contactUsData.length + pageSize }, setIsPageLimitReached).then((response) => {
            setContactUsData([...contactUsData, ...response]);
            if (response.length < pageSize) {
                setIsPageLimitReached(true);
            }
        });
    }

    return (
        <div>
            <ContactUsTable contactUsData={contactUsData} />
            <button onClick={handleLoadMore} disabled={isPageLimitReached}>Load More</button>
        </div>
    )
}

export default ContactUs;
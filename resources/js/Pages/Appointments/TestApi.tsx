import React, { useState, useEffect } from 'react';

export default function TestApi() {
    const [patientId, setPatientId] = useState('1');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);

    const testApi = async () => {
        setLoading(true);
        try {
            console.log('Testing API for patient ID:', patientId);
            const res = await fetch(`/patients/${patientId}/data`);
            console.log('Response status:', res.status);
            console.log('Response ok:', res.ok);
            
            const data = await res.json();
            console.log('Response data:', data);
            
            setResponse(JSON.stringify(data, null, 2));
        } catch (error) {
            console.error('API Error:', error);
            setResponse('Error: ' + (error instanceof Error ? error.message : 'Unknown error'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ direction: 'rtl', padding: '20px' }}>
            <h1>اختبار API</h1>
            
            <div>
                <label>Patient ID: </label>
                <input 
                    type="text" 
                    value={patientId} 
                    onChange={(e) => setPatientId(e.target.value)}
                    placeholder="1"
                />
                <button onClick={testApi} disabled={loading}>
                    {loading ? 'جاري...' : 'اختبار'}
                </button>
            </div>
            
            <pre>{response}</pre>
        </div>
    );
}
export default function NotFound() {
    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#06080d',
            color: 'white',
            fontFamily: 'sans-serif'
        }}>
            <h1 style={{ fontSize: '3rem', margin: '0' }}>404</h1>
            <p style={{ color: '#9ca3af' }}>Page not found</p>
            <a href="/" style={{
                marginTop: '1rem',
                color: '#3b82f6',
                textDecoration: 'none',
                fontWeight: 'bold'
            }}>Return Home</a>
        </div>
    );
}

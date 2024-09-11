// ** Logo
import logo from '../assets/images/logo/logo.png';

const Loading = () => {
    return (
        <div className="fallback-spinner app-loader">
            <h1>Create simulation...</h1>
            <div className="loading">
                <div className="effect-1 effects"></div>
                <div className="effect-2 effects"></div>
                <div className="effect-3 effects"></div>
            </div>
        </div>
    );
};

export default Loading;

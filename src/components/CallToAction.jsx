import React from 'react';
import { Link } from 'react-router-dom';

const CallToAction = () => {
    return (
        <section className="section relative overflow-hidden">
            <div className="absolute inset-0 bg-accent opacity-10"></div>
            <div className="container text-center relative z-10">
                <h2 className="mb-6">Ready to turn up the volume?</h2>
                <Link to="/book" className="btn btn-primary">Reserve Your Spot</Link>
            </div>
        </section>
    );
};

export default CallToAction;

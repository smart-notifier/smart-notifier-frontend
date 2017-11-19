import React from 'react';

export const Box = (props) => (
    <section className="row">
        <div className="col">
            <div className="card">
                {props.header && <div className="card-header"><h2>{props.header}</h2></div>}
                <div className="card-body  has-shadow">
                    {props.title && <h2 className="card-title">{props.title}</h2>}
                    {props.children}
                </div>
            </div>
        </div>
    </section>
);
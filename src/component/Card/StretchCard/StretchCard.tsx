import { faArrowTrendDown, faArrowTrendUp, faNoteSticky } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { ReactNode } from "react";
import './StretchCard.scoped.sass';

export class StretchCard extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
        };
    }

    render(): ReactNode {
        return (
            <div className="card__stretch">
                <div className="card__stretch-left">
                    <div className="card__stretch-item card__stretch-analysis">
                        <span>
                            <FontAwesomeIcon icon={faNoteSticky} />
                            <span>{this.props.data.is_increase ? `+${this.props.data.increase}` : `0`}</span>
                        </span>
                        <span className={this.props.data.is_increase ? "analysis-increase" : "analysis-decrease"}>{this.props.data.is_increase ? `+${this.props.data.percent_increment}%` : `${this.props.data.percent_increment}%`}</span>
                    </div>
                    <div className="card__stretch-item card__stretch-text">
                        <span>{this.props.name}</span>
                    </div>
                </div>
                <div className="card__stretch-right">
                    <FontAwesomeIcon className={this.props.data.is_increase ? "analysis-icon-increase" : "analysis-icon-decrease"} icon={this.props.data.is_increase ? faArrowTrendUp : faArrowTrendDown} />
                </div>
            </div>
        );
    }
}
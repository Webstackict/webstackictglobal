import Section from "@/components/section";
import { cookiePolicy } from "@/lib/contents/legalData";
import classes from "../legal.module.css";

export default function CookiePolicyPage() {
    return (
        <Section title={cookiePolicy.title}>
            <div className={classes.legalContainer}>
                <span className={classes.lastUpdated}>Last Updated: {cookiePolicy.lastUpdated}</span>
                {cookiePolicy.sections.map((section, index) => (
                    <div key={index} className={classes.section}>
                        <h2 className={classes.heading}>{section.heading}</h2>
                        <p className={classes.content}>{section.content}</p>
                    </div>
                ))}
            </div>
        </Section>
    );
}

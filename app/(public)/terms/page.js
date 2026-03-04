import Section from "@/components/section";
import { termsOfService } from "@/lib/contents/legalData";
import classes from "../legal.module.css";

export default function TermsOfServicePage() {
    return (
        <Section title={termsOfService.title}>
            <div className={classes.legalContainer}>
                <span className={classes.lastUpdated}>Last Updated: {termsOfService.lastUpdated}</span>
                {termsOfService.sections.map((section, index) => (
                    <div key={index} className={classes.section}>
                        <h2 className={classes.heading}>{section.heading}</h2>
                        <p className={classes.content}>{section.content}</p>
                    </div>
                ))}
            </div>
        </Section>
    );
}

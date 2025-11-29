   interface FeedbackItems {
        effectiveness: number;
        patientSatisfaction: number;
        sensitivity: number;
        questionQuality: number;
        resolutionLevel: number;
        empowerment: number;
        startingDistress: number;
        whatWorkedWell: string;
        areasForImprovement: string;
        culturalConsiderations: string;
        actionItems: string;
    }
export function FeedbackScreen({data}: {data: FeedbackItems}) {

    try {
        // Remove leading/trailing whitespace and newlines
        const feedback = data;

        //console.log(feedback);
        //console.log(feedback.patientSatisfaction);

        return (
            <div className={"flex flex-row gap-2"}>
                <FeedbackItem color="to-blue-300" name="Effectiveness" message={feedback.effectiveness}/>
                <FeedbackItem color="to-purple-300" name="Patient Satisfaction" message={feedback.patientSatisfaction}/>
            </div>
        )
    } catch (error) {
        console.error('Error parsing AI feedback, try again:', error);
        return <div>"Error parsing AI feedback, try again!"</div>
    }

    function FeedbackItem ({color, name, message}: {color: string, name?: string, message: number}) {
        return (
            <div className={
                `mt-2 flex-col p-3 justify-end text-center max-w-[140px] min-h-[60px] rounded-md justify-center text-${color} bg-gradient-to-b border-2 from-white ${color} `
            }>
            
                <div className="text-3xl font-bold">{message}/10</div>
                <div className="text-lg font-italic">{name}</div>
            </div>
        )
    }
}
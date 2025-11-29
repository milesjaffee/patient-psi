export function FeedbackScreen({data}: {data: string}) {

    const feedbackString = JSON.stringify(data);

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

    let feedback;

    try {
        const feedback: FeedbackItems = JSON.parse(feedbackString);

        return (
        <div>
            <FeedbackItem color={"blue"} message={feedback.effectiveness}/>
        </div>
    )
    } catch (error) {
        console.error('Error parsing AI feedback, try again:', error);
        return <div>"Error parsing AI feedback, try again!"</div>
    }

    function FeedbackItem ({color, message}: {color: string, message: string|number}) {
        return (
            <div
            className={
                'mt-2 flex items-center justify-center gap-2 text-gray-800 text-size-16 bg-gradient-to-r from-green-300 to-white'
            }
            >
            <div className={'max-w-[600px] flex-initial p-2'}>{message}</div>
            </div>
        )
    }

    
}
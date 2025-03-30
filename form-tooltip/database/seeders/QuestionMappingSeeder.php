<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\QuestionMapping;

class QuestionMappingSeeder extends Seeder
{
    public function run()
    {
        $questionMappings = [
            [
                'key' => 'firstName',
                'question' => 'What is your first name?',
                'synonyms' => ['name', 'givenName', 'given name'],
            ],
            [
                'key' => 'lastName',
                'question' => 'What is your last name?',
                'synonyms' => ['surname', 'family name'],
            ],
            [
                'key' => 'fullName',
                'question' => 'What is your first and last name?',
                'synonyms' => ['full name', 'legal name'],
            ],
            [
                'key' => 'email',
                'question' => 'What is your email address?',
                'synonyms' => ['email address', 'E-mail Address'],
            ],
            [
                'key' => 'phone',
                'question' => 'What is your phone number?',
                'synonyms' => ['phone number', 'telephone'],
            ],
            [
                'key' => 'number',
                'question' => 'What is your phone number?',
                'synonyms' => ['phone number', 'telephone', 'work number'],
            ],
            [
                'key' => 'address',
                'question' => 'What is your street address?',
                'synonyms' => ['home address', 'residential address'],
            ],
            [
                'key' => 'city',
                'question' => 'In which city do you live?',
                'synonyms' => ['town', 'municipality'],
            ],
            [
                'key' => 'state',
                'question' => 'What state or province do you reside in?',
                'synonyms' => ['province', 'region'],
            ],
            [
                'key' => 'zip',
                'question' => 'What is your postal code?',
                'synonyms' => ['postal code', 'zip code'],
            ],
            [
                'key' => 'country',
                'question' => 'Which country do you live in?',
                'synonyms' => ['nation'],
            ],
            [
                'key' => 'company',
                'question' => 'What is your company name?',
                'synonyms' => ['organization', 'firm'],
            ],
            [
                'key' => 'jobTitle',
                'question' => 'What is your job title?',
                'synonyms' => ['position', 'role'],
            ],
            [
                'key' => 'website',
                'question' => 'What is your website URL?',
                'synonyms' => ['site', 'web address'],
            ],
            [
                'key' => 'message',
                'question' => 'Please describe your message in detail.',
                'synonyms' => ['description', 'details'],
            ],
            [
                'key' => 'comments',
                'question' => 'Do you have any additional comments?',
                'synonyms' => ['remarks', 'notes'],
            ],
            [
                'key' => 'feedback',
                'question' => 'Please provide your feedback.',
                'synonyms' => ['review', 'comments'],
            ],
            [
                'key' => 'password',
                'question' => 'What is your password for this website or choose a secure password.',
                'synonyms' => ['passphrase'],
            ],
            [
                'key' => 'confirmPassword',
                'question' => 'Confirm your chosen password.',
                'synonyms' => ['verify password', 'password confirmation'],
            ],
            [
                'key' => 'dob',
                'question' => 'What is your date of birth?',
                'synonyms' => ['birthday', 'birthdate'],
            ],
            [
                'key' => 'gender',
                'question' => 'What is your gender?',
                'synonyms' => ['sex'],
            ],
            [
                'key' => 'maritalStatus',
                'question' => 'What is your marital status?',
                'synonyms' => ['relationship status'],
            ],
            [
                'key' => 'occupation',
                'question' => 'What is your occupation?',
                'synonyms' => ['profession', 'career'],
            ],
            [
                'key' => 'industry',
                'question' => 'Which industry do you work in?',
                'synonyms' => ['sector', 'field'],
            ],
            [
                'key' => 'experience',
                'question' => 'How many years of experience do you have?',
                'synonyms' => ['years of experience', 'work experience'],
            ],
            [
                'key' => 'education',
                'question' => 'What is your highest level of education?',
                'synonyms' => ['highest education level', 'educational background'],
            ],
            [
                'key' => 'degree',
                'question' => 'What degree have you earned?',
                'synonyms' => ['type of degree', 'academic degree'],
            ],
            [
                'key' => 'school',
                'question' => 'Which school or institution did you attend?',
                'synonyms' => ['institution', 'university', 'college'],
            ],
            [
                'key' => 'graduationYear',
                'question' => 'What year did you graduate?',
                'synonyms' => ['year of graduation'],
            ],
            [
                'key' => 'reference',
                'question' => 'Please provide a reference if available.',
                'synonyms' => ['recommendation'],
            ],
            [
                'key' => 'commentsOptional',
                'question' => 'Any optional comments?',
                'synonyms' => ['optional remarks', 'additional notes'],
            ],
            [
                'key' => 'projectDescription',
                'question' => 'Briefly describe your project.',
                'synonyms' => ['project summary', 'short project description'],
            ],
            [
                'key' => 'budget',
                'question' => 'What is your budget range?',
                'synonyms' => ['budget', 'price range'],
            ],
            [
                'key' => 'deadline',
                'question' => 'What is your project deadline?',
                'synonyms' => ['project end date', 'completion date'],
            ],
            [
                'key' => 'requirements',
                'question' => 'List your project requirements.',
                'synonyms' => ['project needs', 'specifications'],
            ],
            [
                'key' => 'preferences',
                'question' => 'What are your preferences?',
                'synonyms' => ['choices', 'likes'],
            ],
            [
                'key' => 'timeZone',
                'question' => 'What is your time zone?',
                'synonyms' => ['timezone'],
            ],
            [
                'key' => 'language',
                'question' => 'What is your preferred language?',
                'synonyms' => ['preferred language'],
            ],
            [
                'key' => 'skills',
                'question' => 'List your relevant skills.',
                'synonyms' => ['relevant abilities', 'proficiencies'],
            ],
            [
                'key' => 'interests',
                'question' => 'What are your interests?',
                'synonyms' => ['hobbies', 'passions'],
            ],
            [
                'key' => 'hobbies',
                'question' => 'What are your hobbies?',
                'synonyms' => ['interests', 'pastimes'],
            ],
            [
                'key' => 'bio',
                'question' => 'Write a short bio about yourself.',
                'synonyms' => ['short biography', 'about me'],
            ],
            [
                'key' => 'summary',
                'question' => 'Provide a brief summary of your background.',
                'synonyms' => ['background summary', 'short overview'],
            ],
            [
                'key' => 'purpose',
                'question' => 'What is the purpose of this form?',
                'synonyms' => ['form objective', 'reason for this form'],
            ],
            [
                'key' => 'question1',
                'question' => 'Please answer question 1.',
                'synonyms' => ['response to question 1'],
            ],
            [
                'key' => 'question2',
                'question' => 'Please answer question 2.',
                'synonyms' => ['response to question 2'],
            ],
            [
                'key' => 'question3',
                'question' => 'Please answer question 3.',
                'synonyms' => ['response to question 3'],
            ],
            [
                'key' => 'question4',
                'question' => 'Please answer question 4.',
                'synonyms' => ['response to question 4'],
            ],
            [
                'key' => 'question5',
                'question' => 'Please answer question 5.',
                'synonyms' => ['response to question 5'],
            ],
            [
                'key' => 'referenceCode',
                'question' => 'Enter your reference code, if available.',
                'synonyms' => ['referral code'],
            ],
            [
                'key' => 'promoCode',
                'question' => 'Enter your promotional code.',
                'synonyms' => ['discount code', 'coupon code'],
            ],
            [
                'key' => 'discount',
                'question' => 'What discount are you applying for?',
                'synonyms' => ['type of discount'],
            ],
            [
                'key' => 'subscriptionPlan',
                'question' => 'Choose your subscription plan.',
                'synonyms' => ['select your subscription', 'plan options'],
            ],
            [
                'key' => 'paymentMethod',
                'question' => 'Select your payment method.',
                'synonyms' => ['choose payment option', 'payment type'],
            ],
            [
                'key' => 'cardNumber',
                'question' => 'Enter your card number.',
                'synonyms' => ['credit card number', 'debit card number'],
            ],
            [
                'key' => 'expiryDate',
                'question' => "What is your card's expiry date?",
                'synonyms' => ['card expiration date', 'expiration date'],
            ],
            [
                'key' => 'cvv',
                'question' => "Enter your card's CVV.",
                'synonyms' => ['security code', 'card verification value'],
            ],
            [
                'key' => 'billingAddress',
                'question' => 'What is your billing address?',
                'synonyms' => ['payment address'],
            ],
            [
                'key' => 'shippingAddress',
                'question' => 'What is your shipping address?',
                'synonyms' => ['delivery address'],
            ],
            [
                'key' => 'deliveryInstructions',
                'question' => 'Any special delivery instructions?',
                'synonyms' => ['delivery notes', 'special instructions'],
            ],
            [
                'key' => 'orderNumber',
                'question' => 'Enter your order number.',
                'synonyms' => ['purchase order number'],
            ],
            [
                'key' => 'trackingNumber',
                'question' => 'Enter your tracking number.',
                'synonyms' => ['shipment tracking number'],
            ],
            [
                'key' => 'feedbackRating',
                'question' => 'Rate your experience (1-5).',
                'synonyms' => ['experience rating', 'satisfaction score'],
            ],
            [
                'key' => 'serviceQuality',
                'question' => 'How would you rate our service quality?',
                'synonyms' => ['service rating'],
            ],
            [
                'key' => 'satisfaction',
                'question' => 'How satisfied are you with our service?',
                'synonyms' => ['level of satisfaction', 'happiness with service'],
            ],
            [
                'key' => 'improvementSuggestions',
                'question' => 'Any suggestions for improvement?',
                'synonyms' => ['recommendations', 'ideas for improvement'],
            ],
            [
                'key' => 'contactReason',
                'question' => 'What is the reason for contacting us?',
                'synonyms' => ['reason for contact', 'purpose of contact'],
            ],
            [
                'key' => 'appointmentDate',
                'question' => 'Select your appointment date.',
                'synonyms' => ['preferred date', 'date of appointment'],
            ],
            [
                'key' => 'appointmentTime',
                'question' => 'Select your appointment time.',
                'synonyms' => ['preferred time', 'time of appointment'],
            ],
            [
                'key' => 'consultationType',
                'question' => 'What type of consultation do you need?',
                'synonyms' => ['type of appointment'],
            ],
            [
                'key' => 'preferredContactMethod',
                'question' => 'What is your preferred method of contact?',
                'synonyms' => ['preferred way to contact you'],
            ],
            [
                'key' => 'emergencyContact',
                'question' => 'Enter your emergency contact details.',
                'synonyms' => ['emergency contact information'],
            ],
            [
                'key' => 'relationship',
                'question' => 'What is your relationship with your emergency contact?',
                'synonyms' => ['how are you related to your emergency contact'],
            ],
            [
                'key' => 'medicalHistory',
                'question' => 'Provide your relevant medical history.',
                'synonyms' => ['past medical conditions'],
            ],
            [
                'key' => 'allergies',
                'question' => 'List any allergies you have.',
                'synonyms' => ['allergic reactions'],
            ],
            [
                'key' => 'medications',
                'question' => 'List your current medications.',
                'synonyms' => ['current drugs', 'prescription drugs'],
            ],
            [
                'key' => 'symptoms',
                'question' => 'Describe your symptoms.',
                'synonyms' => ['medical issues', 'health problems'],
            ],
            [
                'key' => 'insuranceProvider',
                'question' => 'Who is your insurance provider?',
                'synonyms' => ['insurance company'],
            ],
            [
                'key' => 'policyNumber',
                'question' => 'Enter your insurance policy number.',
                'synonyms' => ['insurance account number'],
            ],
            [
                'key' => 'claimNumber',
                'question' => 'Enter your claim number (if applicable).',
                'synonyms' => ['insurance claim number'],
            ],
            [
                'key' => 'preferredDoctor',
                'question' => 'Who is your preferred doctor?',
                'synonyms' => ['preferred physician'],
            ],
            [
                'key' => 'referralSource',
                'question' => 'How did you hear about us?',
                'synonyms' => ['how did you find us'],
            ],
            [
                'key' => 'appointmentType',
                'question' => 'Select the type of appointment you need.',
                'synonyms' => ['reason for appointment'],
            ],
            [
                'key' => 'meetingLocation',
                'question' => 'Where will the meeting take place?',
                'synonyms' => ['meeting venue'],
            ],
            [
                'key' => 'roomPreference',
                'question' => 'Do you have a room preference?',
                'synonyms' => ['preferred room'],
            ],
            [
                'key' => 'equipmentNeeded',
                'question' => 'List any equipment you require.',
                'synonyms' => ['project needs', 'specifications'],
            ],
            [
                'key' => 'setupDetails',
                'question' => 'Provide details about the setup.',
                'synonyms' => ['describe the setup needed'],
            ],
            [
                'key' => 'travelDistance',
                'question' => 'What is your expected travel distance?',
                'synonyms' => ['how far do you expect to travel?'],
            ],
            [
                'key' => 'pickupTime',
                'question' => 'Select your pickup time.',
                'synonyms' => ['choose when you want to be picked up'],
            ],
            [
                'key' => 'dropoffTime',
                'question' => 'Select your dropoff time.',
                'synonyms' => ['choose when you want to be dropped off'],
            ],
            [
                'key' => 'deliveryDate',
                'question' => 'Select your delivery date.',
                'synonyms' => ['choose when you want the delivery'],
            ],
            [
                'key' => 'deliveryTime',
                'question' => 'Select your delivery time.',
                'synonyms' => ['choose the time for delivery'],
            ],
            [
                'key' => 'projectBudget',
                'question' => 'What is your project budget?',
                'synonyms' => ['budget for the project'],
            ],
            [
                'key' => 'projectTimeline',
                'question' => 'What is your project timeline?',
                'synonyms' => ['project duration', 'project schedule'],
            ],
            [
                'key' => 'designPreferences',
                'question' => 'Describe your design preferences.',
                'synonyms' => ['design choices', 'preferred design'],
            ],
            [
                'key' => 'colorScheme',
                'question' => 'What color scheme do you prefer?',
                'synonyms' => ['preferred color palette'],
            ],
            [
                'key' => 'logoDetails',
                'question' => 'Provide details for your logo design.',
                'synonyms' => ['logo specifications'],
            ],
            [
                'key' => 'marketingGoals',
                'question' => 'What are your marketing goals?',
                'synonyms' => ['marketing objectives'],
            ],
            [
                'key' => 'targetAudience',
                'question' => 'Who is your target audience?',
                'synonyms' => ['ideal customer', 'intended audience'],
            ],
            [
                'key' => 'socialMedia',
                'question' => 'List your social media handles.',
                'synonyms' => ['social media usernames'],
            ],
            [
                'key' => 'campaignBudget',
                'question' => 'What is your campaign budget?',
                'synonyms' => ['budget for the campaign'],
            ],
            [
                'key' => 'campaignObjective',
                'question' => 'What is your campaign objective?',
                'synonyms' => ['campaign goal'],
            ],
            [
                'key' => 'preferredContactTime',
                'question' => 'What is your preferred time to be contacted?',
                'synonyms' => ['best time to reach you'],
            ],
            [
                'key' => 'communicationMethod',
                'question' => 'Which communication method do you prefer (phone, email, text)?',
                'synonyms' => ['preferred communication channel'],
            ],
            [
                'key' => 'alternateEmail',
                'question' => 'Please provide an alternate email address, if any.',
                'synonyms' => ['secondary email'],
            ],
            [
                'key' => 'emergencyPhone',
                'question' => 'What is your emergency contact phone number?',
                'synonyms' => ['emergency contact number'],
            ],
            [
                'key' => 'residentialAddress',
                'question' => 'What is your full residential address?',
                'synonyms' => ['complete home address'],
            ],
            [
                'key' => 'cityOfResidence',
                'question' => 'Which city do you reside in?',
                'synonyms' => ['city you live in'],
            ],
            [
                'key' => 'stateOfResidence',
                'question' => 'What is your state or province of residence?',
                'synonyms' => ['state/province you live in'],
            ],
            [
                'key' => 'postalCode',
                'question' => 'What is your postal or ZIP code?',
                'synonyms' => ['ZIP code'],
            ],
            [
                'key' => 'countryOfResidence',
                'question' => 'Which country do you live in?',
                'synonyms' => ['country you reside in'],
            ],
            [
                'key' => 'workAddress',
                'question' => 'What is your work address?',
                'synonyms' => ['office address'],
            ],
            [
                'key' => 'positionTitle',
                'question' => 'What is your position or title at work?',
                'synonyms' => ['work title', 'job position'],
            ],
            [
                'key' => 'department',
                'question' => 'Which department do you work in?',
                'synonyms' => ['work department'],
            ],
            [
                'key' => 'workPhone',
                'question' => 'What is your work phone number?',
                'synonyms' => ['office phone number'],
            ],
            [
                'key' => 'linkedinProfile',
                'question' => 'Please provide your LinkedIn profile URL.',
                'synonyms' => ['LinkedIn URL'],
            ],
            [
                'key' => 'twitterHandle',
                'question' => 'What is your Twitter handle?',
                'synonyms' => ['Twitter username'],
            ],
            [
                'key' => 'instagramUsername',
                'question' => 'What is your Instagram username?',
                'synonyms' => ['Instagram handle'],
            ],
            [
                'key' => 'facebookProfile',
                'question' => 'Please share your Facebook profile URL.',
                'synonyms' => ['Facebook URL'],
            ],
            [
                'key' => 'githubUsername',
                'question' => 'What is your GitHub username?',
                'synonyms' => ['GitHub handle'],
            ],
            [
                'key' => 'portfolioUrl',
                'question' => 'What is the URL of your portfolio or website?',
                'synonyms' => ['portfolio website'],
            ],
            [
                'key' => 'preferredLanguage',
                'question' => 'What is your preferred language?',
                'synonyms' => ['language preference'],
            ],
            [
                'key' => 'highestQualification',
                'question' => 'What is your highest qualification?',
                'synonyms' => ['highest educational qualification'],
            ],
            [
                'key' => 'fieldOfStudy',
                'question' => 'What was your field of study?',
                'synonyms' => ['major', 'area of study'],
            ],
            [
                'key' => 'graduationInstitution',
                'question' => 'Which institution did you graduate from?',
                'synonyms' => ['university you graduated from'],
            ],
            [
                'key' => 'yearOfGraduation',
                'question' => 'What year did you graduate?',
                'synonyms' => ['graduation year'],
            ],
            [
                'key' => 'certifications',
                'question' => 'List any certifications you have obtained.',
                'synonyms' => ['professional certifications'],
            ],
            [
                'key' => 'skillsList',
                'question' => 'What are your key skills?',
                'synonyms' => ['main skills', 'core competencies'],
            ],
            [
                'key' => 'hobbiesList',
                'question' => 'What are your hobbies or interests?',
                'synonyms' => ['pastimes', 'things you enjoy'],
            ],
            [
                'key' => 'availableForWork',
                'question' => 'Are you available for work opportunities?',
                'synonyms' => ['job availability', 'open to work'],
            ],
            [
                'key' => 'currentEmployer',
                'question' => 'Who is your current employer?',
                'synonyms' => ['current company'],
            ],
            [
                'key' => 'yearsOfExperience',
                'question' => 'How many years of work experience do you have?',
                'synonyms' => ['total work experience'],
            ],
            [
                'key' => 'industryExperience',
                'question' => 'Which industry do you have experience in?',
                'synonyms' => ['industries worked in'],
            ],
            [
                'key' => 'projectDetails',
                'question' => 'Please describe your project details.',
                'synonyms' => ['project description', 'project information'],
            ],
            [
                'key' => 'projectBudget',
                'question' => 'What is your project budget?',
                'synonyms' => ['budget for this project'],
            ],
            [
                'key' => 'projectDeadline',
                'question' => 'When is your project deadline?',
                'synonyms' => ['deadline for the project'],
            ],
            [
                'key' => 'projectGoals',
                'question' => 'What are your project goals?',
                'synonyms' => ['aims of the project', 'project objectives'],
            ],
            [
                'key' => 'expectedOutcomes',
                'question' => 'What outcomes do you expect from this project?',
                'synonyms' => ['desired results', 'anticipated outcomes'],
            ],
            [
                'key' => 'teamSize',
                'question' => 'What is the size of your team?',
                'synonyms' => ['number of team members'],
            ],
            [
                'key' => 'roleInTeam',
                'question' => 'What is your role within the team?',
                'synonyms' => ['your position in the team'],
            ],
            [
                'key' => 'clientFeedback',
                'question' => 'What feedback have you received from clients?',
                'synonyms' => ['customer feedback'],
            ],
            [
                'key' => 'marketingStrategy',
                'question' => 'What is your current marketing strategy?',
                'synonyms' => ['present marketing approach'],
            ],
            [
                'key' => 'socialMediaUsage',
                'question' => 'Which social media platforms do you use regularly?',
                'synonyms' => ['frequently used social media'],
            ],
            [
                'key' => 'contentPreferences',
                'question' => 'What type of content do you prefer to see?',
                'synonyms' => ['preferred content format'],
            ],
            [
                'key' => 'newsletterSubscription',
                'question' => 'Would you like to subscribe to our newsletter?',
                'synonyms' => ['sign up for newsletter'],
            ],
            [
                'key' => 'serviceInterest',
                'question' => 'Which service are you most interested in?',
                'synonyms' => ['service you are interested in'],
            ],
            [
                'key' => 'productFeedback',
                'question' => 'Please provide feedback on our product.',
                'synonyms' => ['product review', 'comments on our product'],
            ],
            [
                'key' => 'customerSatisfaction',
                'question' => 'How satisfied are you with our service?',
                'synonyms' => ['customer happiness level'],
            ],
            [
                'key' => 'improvementSuggestions',
                'question' => 'What suggestions do you have for improvement?',
                'synonyms' => ['ideas to improve'],
            ],
            [
                'key' => 'contactReason',
                'question' => 'What is the reason for contacting us?',
                'synonyms' => ['why are you contacting us'],
            ],
            [
                'key' => 'appointmentDate',
                'question' => 'Select your appointment date.',
                'synonyms' => ['choose appointment date'],
            ],
            [
                'key' => 'appointmentTime',
                'question' => 'Select your appointment time.',
                'synonyms' => ['choose appointment time'],
            ],
            [
                'key' => 'consultationType',
                'question' => 'What type of consultation do you need?',
                'synonyms' => ['kind of consultation required'],
            ],
            [
                'key' => 'preferredContactMethod',
                'question' => 'What is your preferred method of contact?',
                'synonyms' => ['how would you like us to contact you'],
            ],
            [
                'key' => 'emergencyContact',
                'question' => 'Enter your emergency contact details.',
                'synonyms' => ['provide emergency contact information'],
            ],
            [
                'key' => 'relationship',
                'question' => 'What is your relationship with your emergency contact?',
                'synonyms' => ['how are you related to your emergency contact'],
            ],
            [
                'key' => 'medicalHistory',
                'question' => 'Provide your relevant medical history.',
                'synonyms' => ['share your medical background'],
            ],
            [
                'key' => 'allergies',
                'question' => 'List any allergies you have.',
                'synonyms' => ['any allergies?'],
            ],
            [
                'key' => 'medications',
                'question' => 'List your current medications.',
                'synonyms' => ['medications you are currently taking'],
            ],
            [
                'key' => 'symptoms',
                'question' => 'Describe your symptoms.',
                'synonyms' => ['explain your symptoms'],
            ],
            [
                'key' => 'insuranceProvider',
                'question' => 'Who is your insurance provider?',
                'synonyms' => ['your insurance company name'],
            ],
            [
                'key' => 'policyNumber',
                'question' => 'Enter your insurance policy number.',
                'synonyms' => ['your insurance policy ID'],
            ],
            [
                'key' => 'claimNumber',
                'question' => 'Enter your claim number (if applicable).',
                'synonyms' => ['your claim ID'],
            ],
            [
                'key' => 'preferredDoctor',
                'question' => 'Who is your preferred doctor?',
                'synonyms' => ['your doctor of choice'],
            ],
            [
                'key' => 'referralSource',
                'question' => 'How did you hear about us?',
                'synonyms' => ['where did you learn about us'],
            ],
            [
                'key' => 'appointmentType',
                'question' => 'Select the type of appointment you need.',
                'synonyms' => ['choose the appointment type'],
            ],
            [
                'key' => 'meetingLocation',
                'question' => 'Where will the meeting take place?',
                'synonyms' => ['location of the meeting'],
            ],
            [
                'key' => 'roomPreference',
                'question' => 'Do you have a room preference?',
                'synonyms' => ['any preferred room for the meeting?'],
            ],
            [
                'key' => 'equipmentNeeded',
                'question' => 'List any equipment you require.',
                'synonyms' => ['equipment you need'],
            ],
            [
                'key' => 'productLaunchDate',
                'question' => 'When is your product launch date?',
                'synonyms' => ['when are you launching your product?'],
            ],
            [
                'key' => 'productVersion',
                'question' => 'What is the version of your product?',
                'synonyms' => ['product release'],
            ],
            [
                'key' => 'technicalSupport',
                'question' => 'Do you require technical support?',
                'synonyms' => ['need tech support?'],
            ],
            [
                'key' => 'maintenancePlan',
                'question' => 'What is your preferred maintenance plan?',
                'synonyms' => ['which maintenance plan do you prefer?'],
            ],
            [
                'key' => 'warrantyPeriod',
                'question' => 'What is the warranty period for your product?',
                'synonyms' => ['how long is the warranty?'],
            ],
            [
                'key' => 'returnPolicy',
                'question' => 'What is your return policy?',
                'synonyms' => ['what are your return conditions?'],
            ],
            [
                'key' => 'shippingMethod',
                'question' => 'What shipping method do you prefer?',
                'synonyms' => ['how would you like your order to be shipped?'],
            ],
            [
                'key' => 'orderNumber',
                'question' => 'Enter your order number.',
                'synonyms' => ['your purchase number'],
            ],
            [
                'key' => 'trackingNumber',
                'question' => 'Enter your tracking number.',
                'synonyms' => ['your shipment ID'],
            ],
            [
                'key' => 'customerLoyalty',
                'question' => 'Are you enrolled in our customer loyalty program?',
                'synonyms' => ['are you part of our loyalty program?'],
            ],
            [
                'key' => 'referralProgram',
                'question' => 'Are you interested in our referral program?',
                'synonyms' => ['want to join our referral program?'],
            ],
            [
                'key' => 'satisfactionRating',
                'question' => 'What is your satisfaction rating (1-5)?',
                'synonyms' => ['how satisfied are you on a scale of 1 to 5?'],
            ],
            [
                'key' => 'reviewComments',
                'question' => 'Please leave any review comments you have.',
                'synonyms' => ['any comments on your experience?'],
            ],
            [
                'key' => 'demoRequest',
                'question' => 'Would you like to request a demo?',
                'synonyms' => ['want a demonstration?'],
            ],
            [
                'key' => 'freeTrialRequest',
                'question' => 'Would you like to request a free trial?',
                'synonyms' => ['want to try for free?'],
            ],
            [
                'key' => 'appointmentReason',
                'question' => 'What is the reason for your appointment?',
                'synonyms' => ['why are you booking an appointment?'],
            ],
            [
                'key' => 'additionalNotes',
                'question' => 'Any additional notes or information?',
                'synonyms' => ['anything else you\'d like to add?'],
            ],
            [
                'key' => 'nickname',
                'question' => 'What is your nickname?',
                'synonyms' => ['alias'],
            ],
            [
                'key' => 'middleName',
                'question' => 'What is your middle name?',
                'synonyms' => ['second name'],
            ],
            [
                'key' => 'maidenName',
                'question' => 'What is your mother\'s maiden name?',
                'synonyms' => ['mother\'s birth name'],
            ],
            [
                'key' => 'preferredPronouns',
                'question' => 'What are your preferred pronouns?',
                'synonyms' => ['pronoun preference'],
            ],
            [
                'key' => 'ethnicity',
                'question' => 'What is your ethnicity?',
                'synonyms' => ['ethnic background'],
            ],
            [
                'key' => 'religion',
                'question' => 'What is your religion?',
                'synonyms' => ['religious beliefs'],
            ],
            [
                'key' => 'politicalViews',
                'question' => 'What are your political views?',
                'synonyms' => ['political opinions'],
            ],
            [
                'key' => 'favoriteHobby',
                'question' => 'What is your favorite hobby?',
                'synonyms' => ['preferred pastime'],
            ],
            [
                'key' => 'favoriteBook',
                'question' => 'What is your favorite book?',
                'synonyms' => ['preferred reading'],
            ],
            [
                'key' => 'favoriteMovie',
                'question' => 'What is your favorite movie?',
                'synonyms' => ['preferred film'],
            ],
            [
                'key' => 'favoriteMusicGenre',
                'question' => 'What is your favorite music genre?',
                'synonyms' => ['preferred music style'],
            ],
            [
                'key' => 'favoriteBand',
                'question' => 'Who is your favorite band?',
                'synonyms' => ['preferred musical group'],
            ],
            [
                'key' => 'favoriteSportsTeam',
                'question' => 'What is your favorite sports team?',
                'synonyms' => ['preferred team'],
            ],
            [
                'key' => 'favoriteSport',
                'question' => 'What sport do you enjoy watching the most?',
                'synonyms' => ['preferred spectator sport'],
            ],
            [
                'key' => 'travelFrequency',
                'question' => 'How often do you travel?',
                'synonyms' => ['how frequently do you travel'],
            ],
            [
                'key' => 'favoriteTravelDestination',
                'question' => 'What is your favorite travel destination?',
                'synonyms' => ['preferred vacation spot'],
            ],
            [
                'key' => 'vacationType',
                'question' => 'Do you prefer beach, mountain, or city vacations?',
                'synonyms' => ['preferred type of vacation'],
            ],
            [
                'key' => 'dietaryPreferences',
                'question' => 'Do you have any dietary preferences or restrictions?',
                'synonyms' => ['preferred diet', 'food restrictions'],
            ],
            [
                'key' => 'allergyInfo',
                'question' => 'Do you have any food allergies?',
                'synonyms' => ['food allergies'],
            ],
            [
                'key' => 'exerciseRoutine',
                'question' => 'What does your exercise routine look like?',
                'synonyms' => ['your workout schedule'],
            ],
            [
                'key' => 'healthGoals',
                'question' => 'What are your current health goals?',
                'synonyms' => ['your fitness objectives'],
            ],
            [
                'key' => 'smokingStatus',
                'question' => 'Do you smoke?',
                'synonyms' => ['are you a smoker?'],
            ],
            [
                'key' => 'alcoholConsumption',
                'question' => 'How often do you consume alcohol?',
                'synonyms' => ['how frequently do you drink alcohol'],
            ],
            [
                'key' => 'sleepHours',
                'question' => 'How many hours do you sleep on average?',
                'synonyms' => ['average hours of sleep'],
            ],
            [
                'key' => 'stressLevel',
                'question' => 'How would you rate your stress level?',
                'synonyms' => ['your perceived stress level'],
            ],
            [
                'key' => 'dailyWaterIntake',
                'question' => 'How many glasses of water do you drink daily?',
                'synonyms' => ['daily water consumption'],
            ],
            [
                'key' => 'caffeineIntake',
                'question' => 'How much caffeine do you consume per day?',
                'synonyms' => ['daily caffeine consumption'],
            ],
            [
                'key' => 'meditationPractice',
                'question' => 'Do you practice meditation regularly?',
                'synonyms' => ['regular meditation'],
            ],
            [
                'key' => 'favoriteCuisine',
                'question' => 'What is your favorite type of cuisine?',
                'synonyms' => ['preferred food style'],
            ],
            [
                'key' => 'cookingSkill',
                'question' => 'How would you rate your cooking skills?',
                'synonyms' => ['your self-assessed cooking ability'],
            ],
            [
                'key' => 'mealPreference',
                'question' => 'Do you prefer home-cooked meals or dining out?',
                'synonyms' => ['preferred eating option'],
            ],
            [
                'key' => 'shoppingHabits',
                'question' => 'How often do you shop online?',
                'synonyms' => ['online shopping frequency'],
            ],
            [
                'key' => 'fashionStyle',
                'question' => 'How would you describe your fashion style?',
                'synonyms' => ['your clothing style'],
            ],
            [
                'key' => 'personalBudget',
                'question' => 'What is your monthly personal budget?',
                'synonyms' => ['your monthly spending plan'],
            ],
            [
                'key' => 'savingsGoal',
                'question' => 'What is your savings goal for this year?',
                'synonyms' => ['your annual savings target'],
            ],
            [
                'key' => 'investmentExperience',
                'question' => 'What is your experience with investing?',
                'synonyms' => ['your investing background'],
            ],
            [
                'key' => 'riskTolerance',
                'question' => 'How would you describe your risk tolerance?',
                'synonyms' => ['your comfort level with risk'],
            ],
            [
                'key' => 'creditScore',
                'question' => 'What is your current credit score?',
                'synonyms' => ['your current credit rating'],
            ],
            [
                'key' => 'loanInterest',
                'question' => 'What is your current loan interest rate?',
                'synonyms' => ['interest rate on your loans'],
            ],
            [
                'key' => 'mortgageStatus',
                'question' => 'Do you currently have a mortgage?',
                'synonyms' => ['do you own your home?'],
            ],
            [
                'key' => 'rentalStatus',
                'question' => 'Are you a renter or a homeowner?',
                'synonyms' => ['your housing situation'],
            ],
            [
                'key' => 'insuranceCoverage',
                'question' => 'What types of insurance do you currently have?',
                'synonyms' => ['your current insurance policies'],
            ],
            [
                'key' => 'retirementPlan',
                'question' => 'Do you have a retirement plan in place?',
                'synonyms' => ['your retirement savings plan'],
            ],
            [
                'key' => 'emergencyFund',
                'question' => 'Have you set up an emergency fund?',
                'synonyms' => ['do you have money set aside for emergencies?'],
            ],
            [
                'key' => 'investmentPortfolio',
                'question' => 'How would you describe your investment portfolio?',
                'synonyms' => ['your investment holdings'],
            ],
            [
                'key' => 'financialAdvisor',
                'question' => 'Do you work with a financial advisor?',
                'synonyms' => ['do you have a financial consultant?'],
            ],
            [
                'key' => 'spendingHabits',
                'question' => 'How would you describe your spending habits?',
                'synonyms' => ['your approach to spending money'],
            ],
            [
                'key' => 'budgetingTool',
                'question' => 'Do you use any budgeting tools?',
                'synonyms' => ['do you use software for budgeting?'],
            ],
            [
                'key' => 'creditCardUsage',
                'question' => 'How many credit cards do you have?',
                'synonyms' => ['number of credit cards'],
            ],
            [
                'key' => 'debtLevel',
                'question' => 'What is your current debt level?',
                'synonyms' => ['your total outstanding debt'],
            ],
            [
                'key' => 'carOwnership',
                'question' => 'Do you own a car?',
                'synonyms' => ['do you have a vehicle?'],
            ],
            [
                'key' => 'vehicleType',
                'question' => 'What type of vehicle do you own?',
                'synonyms' => ['make and model of your car'],
            ],
            [
                'key' => 'fuelEfficiency',
                'question' => 'What is your vehicle\'s fuel efficiency?',
                'synonyms' => ['your car\'s gas mileage'],
            ],
            [
                'key' => 'publicTransportUsage',
                'question' => 'How often do you use public transportation?',
                'synonyms' => ['frequency of using buses, trains, etc.'],
            ],
            [
                'key' => 'commuteTime',
                'question' => 'What is your average commute time?',
                'synonyms' => ['how long does it take you to get to work?'],
            ],
            [
                'key' => 'workFromHome',
                'question' => 'Do you work from home?',
                'synonyms' => ['telecommute status'],
            ],
            [
                'key' => 'officeCommute',
                'question' => 'How do you commute to your office?',
                'synonyms' => ['your method of getting to work'],
            ],
            [
                'key' => 'parkingAvailability',
                'question' => 'Is parking available at your workplace?',
                'synonyms' => ['is there parking at your job?'],
            ],
            [
                'key' => 'gymMembership',
                'question' => 'Do you have a gym membership?',
                'synonyms' => ['are you a member of a gym?'],
            ],
            [
                'key' => 'favoriteWorkout',
                'question' => 'What is your favorite workout routine?',
                'synonyms' => ['your preferred way to exercise'],
            ],
            [
                'key' => 'healthSupplements',
                'question' => 'Do you take any health supplements?',
                'synonyms' => ['do you use vitamins or supplements?'],
            ],
            [
                'key' => 'dietType',
                'question' => 'Are you vegetarian, vegan, or follow another diet?',
                'synonyms' => ['your dietary choices'],
            ],
            [
                'key' => 'mealFrequency',
                'question' => 'How many meals do you eat per day?',
                'synonyms' => ['number of daily meals'],
            ],
            [
                'key' => 'snackingHabit',
                'question' => 'Do you snack frequently?',
                'synonyms' => ['do you often eat between meals?'],
            ],
            [
                'key' => 'cookingFrequency',
                'question' => 'How often do you cook at home?',
                'synonyms' => ['how regularly do you prepare your own food?'],
            ],
            [
                'key' => 'foodBudget',
                'question' => 'What is your monthly food budget?',
                'synonyms' => ['how much do you spend on food each month?'],
            ],
            [
                'key' => 'travelPreferences',
                'question' => 'What are your travel preferences?',
                'synonyms' => ['how do you like to travel?'],
            ],
            [
                'key' => 'accommodationPreference',
                'question' => 'Do you prefer hotels, hostels, or vacation rentals?',
                'synonyms' => ['your preferred type of lodging'],
            ],
            [
                'key' => 'vacationBudget',
                'question' => 'What is your typical vacation budget?',
                'synonyms' => ['how much do you usually spend on a trip?'],
            ],
            [
                'key' => 'travelCompanions',
                'question' => 'Do you usually travel alone or with others?',
                'synonyms' => ['who do you typically travel with?'],
            ],
            [
                'key' => 'preferredAirline',
                'question' => 'Do you have a preferred airline?',
                'synonyms' => ['your favorite airline'],
            ],
            [
                'key' => 'frequentFlyer',
                'question' => 'Are you a frequent flyer?',
                'synonyms' => ['do you travel often by plane?'],
            ],
            [
                'key' => 'visaRequirements',
                'question' => 'Do you require visa assistance?',
                'synonyms' => ['do you need help with a visa?'],
            ],
            [
                'key' => 'travelInsurance',
                'question' => 'Do you purchase travel insurance?',
                'synonyms' => ['do you usually get insurance for your trips?'],
            ],
            [
                'key' => 'languageProficiency',
                'question' => 'Which languages are you proficient in?',
                'synonyms' => ['languages you can speak fluently'],
            ],
            [
                'key' => 'foreignTravelExperience',
                'question' => 'How often do you travel internationally?',
                'synonyms' => ['frequency of international trips'],
            ],
            [
                'key' => 'culturalInterests',
                'question' => 'What cultural activities interest you?',
                'synonyms' => ['things you like to do related to culture'],
            ],
            [
                'key' => 'artInterests',
                'question' => 'What type of art do you appreciate?',
                'synonyms' => ['your taste in art'],
            ],
            [
                'key' => 'musicInterests',
                'question' => 'What kind of music do you enjoy?',
                'synonyms' => ['your musical tastes'],
            ],
            [
                'key' => 'sportsParticipation',
                'question' => 'Do you actively participate in any sports?',
                'synonyms' => ['sports you play'],
            ],
            [
                'key' => 'outdoorActivities',
                'question' => 'What outdoor activities do you enjoy?',
                'synonyms' => ['things you like to do outside'],
            ],
            [
                'key' => 'techSavviness',
                'question' => 'How would you rate your tech savviness?',
                'synonyms' => ['your comfort level with technology'],
            ],
            [
                'key' => 'appUsage',
                'question' => 'Which mobile apps do you use daily?',
                'synonyms' => ['apps you use every day'],
            ],
            [
                'key' => 'socialNetworking',
                'question' => 'How active are you on social networking sites?',
                'synonyms' => ['your level of activity on social media'],
            ],
            [
                'key' => 'onlineShopping',
                'question' => 'How often do you shop online?',
                'synonyms' => ['frequency of online purchases'],
            ],
            [
                'key' => 'streamingServices',
                'question' => 'Which streaming services do you subscribe to?',
                'synonyms' => ['video and music streaming subscriptions'],
            ],
            [
                'key' => 'gamingInterest',
                'question' => 'Are you interested in video games?',
                'synonyms' => ['do you like playing video games?'],
            ],
            [
                'key' => 'pcGaming',
                'question' => 'Do you play PC games?',
                'synonyms' => ['do you game on a computer?'],
            ],
            [
                'key' => 'consoleGaming',
                'question' => 'Do you play console games?',
                'synonyms' => ['do you game on PlayStation, Xbox, etc.?'],
            ],
            [
                'key' => 'mobileGaming',
                'question' => 'Do you play mobile games?',
                'synonyms' => ['do you game on your phone or tablet?'],
            ],
            [
                'key' => 'favoriteGameGenre',
                'question' => 'What is your favorite game genre?',
                'synonyms' => ['preferred type of video game'],
            ],
            [
                'key' => 'eSportsInterest',
                'question' => 'Are you interested in eSports?',
                'synonyms' => ['do you follow competitive gaming?'],
            ],
            [
                'key' => 'learningStyle',
                'question' => 'What is your preferred learning style?',
                'synonyms' => ['how do you learn best?'],
            ],
            [
                'key' => 'onlineCourses',
                'question' => 'Do you take online courses?',
                'synonyms' => ['do you study online?'],
            ],
            [
                'key' => 'educationalPlatform',
                'question' => 'Which educational platforms do you use?',
                'synonyms' => ['websites for online learning'],
            ],
            [
                'key' => 'certificationGoals',
                'question' => 'Are you pursuing any certifications?',
                'synonyms' => ['are you working towards any professional credentials?'],
            ],
            [
                'key' => 'careerGoals',
                'question' => 'What are your career goals?',
                'synonyms' => ['your professional ambitions'],
            ],
            [
                'key' => 'professionalDevelopment',
                'question' => 'How do you pursue professional development?',
                'synonyms' => ['how do you improve your skills at work?'],
            ],
            [
                'key' => 'networkingEvents',
                'question' => 'Do you attend networking events?',
                'synonyms' => ['do you go to events to meet other professionals?'],
            ],
            [
                'key' => 'mentorship',
                'question' => 'Are you interested in mentorship opportunities?',
                'synonyms' => ['would you like a mentor?'],
            ],
            [
                'key' => 'industryConferences',
                'question' => 'Do you attend industry conferences?',
                'synonyms' => ['do you go to conferences related to your field?'],
            ],
            [
                'key' => 'businessPublications',
                'question' => 'Which business publications do you read?',
                'synonyms' => ['what business magazines or websites do you follow?'],
            ],
            [
                'key' => 'investmentInterests',
                'question' => 'What types of investments interest you?',
                'synonyms' => ['what kind of investing are you interested in?'],
            ],
            [
                'key' => 'savingsStrategy',
                'question' => 'What is your savings strategy?',
                'synonyms' => ['how do you save money?'],
            ],
            [
                'key' => 'financialPlanning',
                'question' => 'How do you plan your finances?',
                'synonyms' => ['how do you manage your money?'],
            ],
            [
                'key' => 'retirementSavings',
                'question' => 'How much do you save for retirement monthly?',
                'synonyms' => ['your monthly retirement contributions'],
            ],
            [
                'key' => 'realEstateInvesting',
                'question' => 'Are you interested in real estate investing?',
                'synonyms' => ['do you want to invest in property?'],
            ],
            [
                'key' => 'stockInvesting',
                'question' => 'Do you invest in stocks?',
                'synonyms' => ['do you buy and sell shares?'],
            ],
            [
                'key' => 'bondInvesting',
                'question' => 'Do you invest in bonds?',
                'synonyms' => ['do you invest in debt instruments?'],
            ],
            [
                'key' => 'cryptocurrencyInterest',
                'question' => 'Are you interested in cryptocurrencies?',
                'synonyms' => ['do you follow Bitcoin, Ethereum, etc.?'],
            ],
            [
                'key' => 'riskManagementStrategy',
                'question' => 'What is your risk management strategy?',
                'synonyms' => ['how do you handle financial risks?'],
            ],
            [
                'key' => 'budgetingExperience',
                'question' => 'How experienced are you with budgeting?',
                'synonyms' => ['how good are you at making a budget?'],
            ],
            [
                'key' => 'debtManagement',
                'question' => 'How do you manage your debts?',
                'synonyms' => ['how do you handle loans and other debts?'],
            ],
            [
                'key' => 'creditManagement',
                'question' => 'How do you manage your credit?',
                'synonyms' => ['how do you handle your credit cards and credit score?'],
            ],
            [
                'key' => 'financialGoalsShortTerm',
                'question' => 'What are your short-term financial goals?',
                'synonyms' => ['your immediate money goals'],
            ],
            [
                'key' => 'financialGoalsLongTerm',
                'question' => 'What are your long-term financial goals?',
                'synonyms' => ['your future money goals'],
            ],
            [
                'key' => 'investmentTimeHorizon',
                'question' => 'What is your investment time horizon?',
                'synonyms' => ['how long do you plan to invest for?'],
            ],
            [
                'key' => 'taxPlanning',
                'question' => 'How do you plan for taxes?',
                'synonyms' => ['how do you prepare for tax season?'],
            ],
            [
                'key' => 'estatePlanning',
                'question' => 'Do you have an estate plan?',
                'synonyms' => ['do you have a will or trust?'],
            ],
            [
                'key' => 'charityDonations',
                'question' => 'Do you make regular charity donations?',
                'synonyms' => ['do you often donate to good causes?'],
            ],
            [
                'key' => 'volunteerWork',
                'question' => 'Do you participate in volunteer work?',
                'synonyms' => ['do you help out in your community?'],
            ],
            [
                'key' => 'environmentalValues',
                'question' => 'How important are environmental values to you?',
                'synonyms' => ['how much do you care about the environment?'],
            ],
            [
                'key' => 'politicalEngagement',
                'question' => 'How engaged are you politically?',
                'synonyms' => ['how involved are you in politics?'],
            ],
            [
                'key' => 'communityService',
                'question' => 'Do you participate in community service?',
                'synonyms' => ['do you volunteer in your community?'],
            ],
            [
                'key' => 'personalBrand',
                'question' => 'How do you promote your personal brand?',
                'synonyms' => ['how do you market yourself?'],
            ],
            [
                'key' => 'socialMediaStrategy',
                'question' => 'What is your social media strategy?',
                'synonyms' => ['how do you use social media?'],
            ],
            [
                'key' => 'blogging',
                'question' => 'Do you maintain a blog?',
                'synonyms' => ['do you write a web log?'],
            ],
            [
                'key' => 'podcasting',
                'question' => 'Are you interested in podcasting?',
                'synonyms' => ['do you like listening to or creating podcasts?'],
            ],
            [
                'key' => 'videoContent',
                'question' => 'Do you create video content?',
                'synonyms' => ['do you make videos?'],
            ],
            [
                'key' => 'onlinePresenceStrength',
                'question' => 'How strong is your online presence?',
                'synonyms' => ['how visible are you on the internet?'],
            ],
            [
                'key' => 'digitalFootprint',
                'question' => 'What is your digital footprint like?',
                'synonyms' => ['what information about you is online?'],
            ],
            [
                'key' => 'cyberSecurityAwareness',
                'question' => 'How aware are you of cyber security practices?',
                'synonyms' => ['how much do you know about online safety?'],
            ],
            [
                'key' => 'privacyConcerns',
                'question' => 'How concerned are you about online privacy?',
                'synonyms' => ['how worried are you about your data online?'],
            ],
            [
                'key' => 'dataUsage',
                'question' => 'How do you manage your data usage?',
                'synonyms' => ['how do you keep track of your internet data?'],
            ],
            [
                'key' => 'technologyAdoption',
                'question' => 'How quickly do you adopt new technology?',
                'synonyms' => ['how soon do you start using new tech?'],
            ],
            [
                'key' => 'appUsageFrequency',
                'question' => 'How frequently do you use mobile apps?',
                'synonyms' => ['how often do you use apps on your phone?'],
            ],
            [
                'key' => 'internetSpeed',
                'question' => 'What is your average internet speed?',
                'synonyms' => ['how fast is your internet connection?'],
            ],
            [
                'key' => 'deviceUsage',
                'question' => 'What devices do you use regularly?',
                'synonyms' => ['what gadgets do you use often?'],
            ],
            [
                'key' => 'wearableTech',
                'question' => 'Do you use any wearable technology?',
                'synonyms' => ['do you use smartwatches or fitness trackers?'],
            ],
            [
                'key' => 'smartHomeDevices',
                'question' => 'Do you use smart home devices?',
                'synonyms' => ['do you have connected devices in your home?'],
            ],
            [
                'key' => 'onlineShoppingPreference',
                'question' => 'What is your online shopping preference?',
                'synonyms' => ['how do you prefer to shop online?'],
            ],
            [
                'key' => 'ecommerceExperience',
                'question' => 'Describe your eCommerce experience.',
                'synonyms' => ['tell us about your online buying and selling'],
            ],
            [
                'key' => 'mobilePaymentUsage',
                'question' => 'Do you use mobile payment systems?',
                'synonyms' => ['do you pay with your phone?'],
            ],
            [
                'key' => 'contactlessPayments',
                'question' => 'How often do you use contactless payments?',
                'synonyms' => ['how often do you tap to pay?'],
            ],
            [
                'key' => 'bankingAppUsage',
                'question' => 'Do you use a mobile banking app?',
                'synonyms' => ['do you manage your bank account on your phone?'],
            ],
            [
                'key' => 'investmentAppUsage',
                'question' => 'Do you use investment apps?',
                'synonyms' => ['do you manage your investments on your phone?'],
            ],
            [
                'key' => 'cryptoTrading',
                'question' => 'Do you trade cryptocurrencies?',
                'synonyms' => ['do you buy and sell Bitcoin, etc.?'],
            ],
            [
                'key' => 'financialNewsSources',
                'question' => 'What are your preferred financial news sources?',
                'synonyms' => ['where do you get your finance news?'],
            ],
            [
                'key' => 'spendingTracker',
                'question' => 'Do you use a spending tracker?',
                'synonyms' => ['do you use an app to track your expenses?'],
            ],
            [
                'key' => 'creditMonitoring',
                'question' => 'Do you monitor your credit score?',
                'synonyms' => ['do you keep an eye on your credit rating?'],
            ],
            [
                'key' => 'customerOnboardingSatisfaction',
                'question' => 'How satisfied are you with your customer onboarding process?',
                'synonyms' => ['how happy were you with the signup process?'],
            ],
            [
                'key' => 'afterSaleServiceRating',
                'question' => 'How would you rate our after-sale service?',
                'synonyms' => ['how was our support after you bought something?'],
            ],
            [
                'key' => 'warrantyClaimFrequency',
                'question' => 'How frequently do you file warranty claims?',
                'synonyms' => ['how often do you use your product warranty?'],
            ],
            [
                'key' => 'userInterfaceResponsiveness',
                'question' => 'How responsive do you find our user interface?',
                'synonyms' => ['how quickly does our app/website react?'],
            ],
            [
                'key' => 'mobileAppPerformance',
                'question' => 'How is the performance of our mobile app?',
                'synonyms' => ['how well does our app run?'],
            ],
            [
                'key' => 'serverScalability',
                'question' => 'How scalable do you find our server infrastructure?',
                'synonyms' => ['can our servers handle more users?'],
            ],
            [
                'key' => 'dataBackupFrequency',
                'question' => 'How often do you perform data backups?',
                'synonyms' => ['how often do you save your data?'],
            ],
            [
                'key' => 'disasterRecoveryPlan',
                'question' => 'Do you have a disaster recovery plan in place?',
                'synonyms' => ['do you have a plan for when things go wrong?'],
            ],
            [
                'key' => 'employeeTurnoverCost',
                'question' => 'What is the cost associated with employee turnover?',
                'synonyms' => ['how much does it cost when employees leave?'],
            ],
            [
                'key' => 'trainingEffectiveness',
                'question' => 'How effective are your employee training programs?',
                'synonyms' => ['how well do your training programs work?'],
            ],
            [
                'key' => 'clientRetentionStrategy',
                'question' => 'What strategies do you use to retain clients?',
                'synonyms' => ['how do you keep your clients happy?'],
            ],
            [
                'key' => 'sustainabilityInvestments',
                'question' => 'How much do you invest in sustainability initiatives?',
                'synonyms' => ['how much do you spend on eco-friendly projects?'],
            ],
            [
                'key' => 'brandAwarenessCampaign',
                'question' => 'Describe your brand awareness campaign.',
                'synonyms' => ['tell us about how you\'re making people know your brand'],
            ],
            [
                'key' => 'socialMediaInfluence',
                'question' => 'How influential are your social media channels?',
                'synonyms' => ['how much impact do your social media posts have?'],
            ],
            [
                'key' => 'digitalEngagement',
                'question' => 'How engaged are your users in digital channels?',
                'synonyms' => ['how much do your users interact online?'],
            ],
            [
                'key' => 'productInnovationIndex',
                'question' => 'How innovative is your product line?',
                'synonyms' => ['how new and original are your products?'],
            ],
            [
                'key' => 'marketGrowthProjection',
                'question' => 'What is your projected market growth?',
                'synonyms' => ['how much do you expect your market to grow?'],
            ],
            [
                'key' => 'profitGrowthProjection',
                'question' => 'What is your projected profit growth?',
                'synonyms' => ['how much do you expect your profits to increase?'],
            ],
            [
                'key' => 'investmentReturn',
                'question' => 'How would you describe your return on investment?',
                'synonyms' => ['how much profit do you make from your investments?'],
            ],
            [
                'key' => 'customerAcquisitionTime',
                'question' => 'How long does it take to acquire a new customer?',
                'synonyms' => ['how long to get a new client?'],
            ],
            [
                'key' => 'salesCycleDuration',
                'question' => 'What is the typical duration of your sales cycle?',
                'synonyms' => ['how long does it usually take to make a sale?'],
            ],
            [
                'key' => 'leadTime',
                'question' => 'What is your average lead time from inquiry to sale?',
                'synonyms' => ['how long from someone asking to them buying?'],
            ],
            [
                'key' => 'contractRenewalRate',
                'question' => 'What is your contract renewal rate?',
                'synonyms' => ['how many contracts get renewed?'],
            ],
            [
                'key' => 'customerEscalationRate',
                'question' => 'How often do customer issues escalate?',
                'synonyms' => ['how often do customer problems get serious?'],
            ],
            [
                'key' => 'supportSatisfactionRating',
                'question' => 'How satisfied are customers with support?',
                'synonyms' => ['how happy are customers with the help they get?'],
            ],
            [
                'key' => 'netRevenueRetention',
                'question' => 'What is your net revenue retention rate?',
                'synonyms' => ['how much revenue do you keep from existing customers?'],
            ],
            [
                'key' => 'grossMargin',
                'question' => 'What is your gross margin percentage?',
                'synonyms' => ['profit after subtracting cost of goods'],
            ],
            [
                'key' => 'operatingMargin',
                'question' => 'What is your operating margin percentage?',
                'synonyms' => ['profit after operating expenses'],
            ],
            [
                'key' => 'earningsBeforeTax',
                'question' => 'What are your earnings before tax?',
                'synonyms' => ['profit before taxes'],
            ],
            [
                'key' => 'researchGrants',
                'question' => 'Do you receive research grants?',
                'synonyms' => ['do you get funding for research?'],
            ],
            [
                'key' => 'patentFilingRate',
                'question' => 'How often do you file for patents?',
                'synonyms' => ['how often do you apply for patents?'],
            ],
            [
                'key' => 'competitiveBenchmarking',
                'question' => 'How do you benchmark against competitors?',
                'synonyms' => ['how do you compare yourself to your rivals?'],
            ],
            [
                'key' => 'marketRiskAssessment',
                'question' => 'How do you assess market risk?',
                'synonyms' => ['how do you figure out the risks in the market?'],
            ],
            [
                'key' => 'supplyChainReliability',
                'question' => 'How reliable is your supply chain?',
                'synonyms' => ['can you depend on your suppliers?'],
            ],
            [
                'key' => 'vendorDiversity',
                'question' => 'How diverse are your vendors?',
                'synonyms' => ['do you have suppliers from different backgrounds?'],
            ],
            [
                'key' => 'resourceUtilization',
                'question' => 'How efficiently do you utilize resources?',
                'synonyms' => ['how well do you use your resources?'],
            ],
            [
                'key' => 'energyConsumption',
                'question' => 'What is your energy consumption like?',
                'synonyms' => ['how much energy do you use?'],
            ],
            [
                'key' => 'wasteManagement',
                'question' => 'How do you manage waste in your operations?',
                'synonyms' => ['how do you deal with your company\'s waste?'],
            ],
            [
                'key' => 'carbonFootprint',
                'question' => 'What is your company\'s carbon footprint?',
                'synonyms' => ['how much greenhouse gas does your company produce?'],
            ],
            [
                'key' => 'waterUsage',
                'question' => 'How much water does your operation use?',
                'synonyms' => ['how much water do you use for your business?'],
            ],
            [
                'key' => 'greenInitiatives',
                'question' => 'What green initiatives are you undertaking?',
                'synonyms' => ['what are you doing to be more environmentally friendly?'],
            ],
            [
                'key' => 'sustainableSourcing',
                'question' => 'Do you practice sustainable sourcing?',
                'synonyms' => ['do you get your materials in an environmentally friendly way?'],
            ],
            [
                'key' => 'ecoFriendlyProducts',
                'question' => 'Do you offer eco-friendly products?',
                'synonyms' => ['do you sell environmentally friendly items?'],
            ],
            [
                'key' => 'corporateEthics',
                'question' => 'How would you describe your corporate ethics?',
                'synonyms' => ['what are your company\'s moral principles?'],
            ],
            [
                'key' => 'customerDataPrivacy',
                'question' => 'How do you protect customer data privacy?',
                'synonyms' => ['how do you keep customer information safe?'],
            ],
            [
                'key' => 'informationSecurityPolicy',
                'question' => 'What is your information security policy?',
                'synonyms' => ['what are your rules for keeping data secure?'],
            ],
            [
                'key' => 'complianceTraining',
                'question' => 'Do you provide compliance training for employees?',
                'synonyms' => ['do you train your staff on following rules?'],
            ],
            [
                'key' => 'vendorRiskManagement',
                'question' => 'How do you manage vendor risk?',
                'synonyms' => ['how do you handle problems with your suppliers?'],
            ],
            [
                'key' => 'contractualObligations',
                'question' => 'What are your key contractual obligations?',
                'synonyms' => ['what are your main responsibilities in your contracts?'],
            ],
            [
                'key' => 'clientOnboardingTime',
                'question' => 'How long does it take to onboard a new client?',
                'synonyms' => ['how long to get a new client set up?'],
            ],
            [
                'key' => 'serviceLevelAgreement',
                'question' => 'What are the terms of your service level agreements?',
                'synonyms' => ['what promises do you make about your service?'],
            ],
            [
                'key' => 'operationalEfficiencyRating',
                'question' => 'How do you rate your operational efficiency?',
                'synonyms' => ['how well do your business operations run?'],
            ],
            [
                'key' => 'processImprovement',
                'question' => 'What steps do you take to improve processes?',
                'synonyms' => ['how do you make your work better?'],
            ],
            [
                'key' => 'digitalTransformationIndex',
                'question' => 'What is your digital transformation index?',
                'synonyms' => ['how much have you moved to digital operations?'],
            ],
            [
                'key' => 'cloudAdoptionLevel',
                'question' => 'How extensively do you use cloud technology?',
                'synonyms' => ['how much do you use online services?'],
            ],
            [
                'key' => 'aiIntegrationLevel',
                'question' => 'To what extent have you integrated AI into your operations?',
                'synonyms' => ['how much do you use artificial intelligence?'],
            ],
            [
                'key' => 'automationImpact',
                'question' => 'What impact has automation had on your processes?',
                'synonyms' => ['how has using machines to do tasks affected your work?'],
            ],
            [
                'key' => 'itCostManagement',
                'question' => 'How do you manage IT costs?',
                'synonyms' => ['how do you control your technology expenses?'],
            ],
            [
                'key' => 'softwareLicensing',
                'question' => 'How do you handle software licensing?',
                'synonyms' => ['how do you manage your software usage rights?'],
            ],
            [
                'key' => 'customerDataAnalyticsUsage',
                'question' => 'How do you use customer data analytics?',
                'synonyms' => ['how do you use information about your customers?'],
            ],
            [
                'key' => 'marketingAutomationUsage',
                'question' => 'Do you use marketing automation tools?',
                'synonyms' => ['do you use software to automate marketing tasks?'],
            ],
            [
                'key' => 'leadScoringEffectiveness',
                'question' => 'How effective is your lead scoring system?',
                'synonyms' => ['how well does your system identify potential customers?'],
            ],
            [
                'key' => 'salesForecastAccuracy',
                'question' => 'How accurate are your sales forecasts?',
                'synonyms' => ['how correct are your predictions about sales?'],
            ],
            [
                'key' => 'inventoryAccuracyRate',
                'question' => 'What is your inventory accuracy rate?',
                'synonyms' => ['how correct is your record of what you have in stock?'],
            ],
            [
                'key' => 'supplyChainVisibility',
                'question' => 'How visible is your supply chain?',
                'synonyms' => ['how well can you see what\'s happening in your supply chain?'],
            ],
            [
                'key' => 'logisticsEfficiencyRating',
                'question' => 'How efficient is your logistics network?',
                'synonyms' => ['how well does your delivery system work?'],
            ],
            [
                'key' => 'distributionCostEfficiency',
                'question' => 'How cost-effective is your distribution network?',
                'synonyms' => ['how cheap is your delivery system?'],
            ],
            [
                'key' => 'customerAcquisitionCostOptimization',
                'question' => 'How do you optimize customer acquisition costs?',
                'synonyms' => ['how do you try to spend less to get new customers?'],
            ],
            [
                'key' => 'brandEquityScore',
                'question' => 'What is your brand equity score?',
                'synonyms' => ['how valuable is your brand?'],
            ],
            [
                'key' => 'socialResponsibilityScoreExtra',
                'question' => 'How do you measure your social responsibility?',
                'synonyms' => ['how do you check if you\'re being a responsible company?'],
            ],
            [
                'key' => 'communityEngagementIndexExtra',
                'question' => 'What is your community engagement index?',
                'synonyms' => ['how involved are you with your local community?'],
            ],
            [
                'key' => 'employeeWellnessProgramEffectiveness',
                'question' => 'How effective are your employee wellness programs?',
                'synonyms' => ['how well do your programs help employees\' well-being?'],
            ],
            [
                'key' => 'workforceProductivityIndex',
                'question' => 'What is your workforce productivity index?',
                'synonyms' => ['how much work does your staff get done?'],
            ],
            [
                'key' => 'corporateCultureIndex',
                'question' => 'How would you rate your corporate culture?',
                'synonyms' => ['what\'s the atmosphere like at your company?'],
            ],
            [
                'key' => 'innovationPipelineSpeed',
                'question' => 'How fast is your innovation pipeline?',
                'synonyms' => ['how quickly do you come up with new ideas?'],
            ],
            [
                'key' => 'newProductLaunchFrequency',
                'question' => 'How frequently do you launch new products?',
                'synonyms' => ['how often do you release new products?'],
            ],
            [
                'key' => 'marketSaturationLevel',
                'question' => 'What is the saturation level of your market?',
                'synonyms' => ['how much of the market is already taken?'],
            ],
            [
                'key' => 'customerServiceTrainingEffectiveness',
                'question' => 'How effective is your customer service training?',
                'synonyms' => ['how well do you train your staff to help customers?'],
            ],
            [
                'key' => 'userExperienceDesignQuality',
                'question' => 'How would you rate your user experience design quality?',
                'synonyms' => ['how good is the experience of using your product?'],
            ],
            [
                'key' => 'uxUsabilityTestingResults',
                'question' => 'What do your usability tests reveal about UX?',
                'synonyms' => ['what do tests show about how easy your product is to use?'],
            ],
            [
                'key' => 'uiConsistencyScore',
                'question' => 'How consistent is your UI across platforms?',
                'synonyms' => ['how similar does your interface look on different devices?'],
            ],
            [
                'key' => 'mobileAppUsabilityScore',
                'question' => 'How usable is your mobile app?',
                'synonyms' => ['how easy is your app to use?'],
            ],
            [
                'key' => 'websiteConversionRateImprovement',
                'question' => 'Have you improved your website conversion rate?',
                'synonyms' => ['have more website visitors become customers?'],
            ],
            [
                'key' => 'trafficSourcesDiversity',
                'question' => 'How diverse are your website traffic sources?',
                'synonyms' => ['where do your website visitors come from?'],
            ],
            [
                'key' => 'bounceRateImprovement',
                'question' => 'Have you improved your website bounce rate?',
                'synonyms' => ['are fewer people leaving your website quickly?'],
            ],
            [
                'key' => 'averageSessionDuration',
                'question' => 'What is the average session duration on your website?',
                'synonyms' => ['how long do people usually stay on your website?'],
            ],
            [
                'key' => 'pageViewsPerSession',
                'question' => 'What is the average number of page views per session?',
                'synonyms' => ['how many pages do people look at on your website?'],
            ],
            [
                'key' => 'returnVisitorRate',
                'question' => 'What percentage of your visitors are returning?',
                'synonyms' => ['how many people come back to your website?'],
            ],
            [
                'key' => 'customerReferralRate',
                'question' => 'What is your customer referral rate?',
                'synonyms' => ['how many new customers come from existing customers?'],
            ],
            [
                'key' => 'wordOfMouthEffectiveness',
                'question' => 'How effective is word-of-mouth marketing for you?',
                'synonyms' => ['how well does people talking about you help your business?'],
            ],
            [
                'key' => 'customerAdvocacyLevel',
                'question' => 'How strong is customer advocacy for your brand?',
                'synonyms' => ['how much do your customers support your brand?'],
            ],
            [
                'key' => 'netPromoterScoreImprovement',
                'question' => 'Have you seen improvements in your Net Promoter Score?',
                'synonyms' => ['are more people likely to recommend your product?'],
            ],
            [
                'key' => 'feedbackLoopEfficiency',
                'question' => 'How efficient is your feedback loop?',
                'synonyms' => ['how quickly do you act on customer feedback?'],
            ],
            [
                'key' => 'productIterationSpeed',
                'question' => 'How quickly do you iterate on your products?',
                'synonyms' => ['how fast do you make changes to your products?'],
            ],
            [
                'key' => 'featureAdoptionRate',
                'question' => 'What is your rate of new feature adoption?',
                'synonyms' => ['how quickly do people start using new features?'],
            ],
            [
                'key' => 'subscriptionGrowthRate',
                'question' => 'How fast is your subscription base growing?',
                'synonyms' => ['how quickly are you getting new subscribers?'],
            ],
            [
                'key' => 'revenuePerUser',
                'question' => 'What is your revenue per user?',
                'synonyms' => ['how much money do you make from each user?'],
            ],
            [
                'key' => 'churnRateReduction',
                'question' => 'Have you reduced your customer churn rate?',
                'synonyms' => ['are fewer customers leaving your service?'],
            ],
            [
                'key' => 'profitabilityAnalysisMethod',
                'question' => 'How do you analyze your profitability?',
                'synonyms' => ['how do you figure out if you\'re making money?'],
            ],
            [
                'key' => 'marketDiversificationStrategy',
                'question' => 'What is your strategy for market diversification?',
                'synonyms' => ['how are you trying to reach different markets?'],
            ],
            [
                'key' => 'globalExpansionPlanDetails',
                'question' => 'Describe your global expansion plans.',
                'synonyms' => ['tell us about your plans to go international'],
            ],
            [
                'key' => 'regionalMarketAnalysis',
                'question' => 'What does your regional market analysis reveal?',
                'synonyms' => ['what does looking at local markets tell you?'],
            ],
            [
                'key' => 'economicForecastAccuracy',
                'question' => 'How accurate are your economic forecasts?',
                'synonyms' => ['how correct are your predictions about the economy?'],
            ],
            [
                'key' => 'currencyRiskManagementStrategy',
                'question' => 'How do you manage currency risk?',
                'synonyms' => ['how do you handle the risks of dealing with different currencies?'],
            ],
            [
                'key' => 'tradeTariffsImpact',
                'question' => 'How do trade tariffs impact your business?',
                'synonyms' => ['how do taxes on imports and exports affect you?'],
            ],
            [
                'key' => 'importExportComplianceProcess',
                'question' => 'Describe your import/export compliance process.',
                'synonyms' => ['tell us how you follow the rules for importing and exporting'],
            ],
            [
                'key' => 'internationalBusinessStrategy',
                'question' => 'What is your international business strategy?',
                'synonyms' => ['how do you plan to do business in other countries?'],
            ],
            [
                'key' => 'crossBorderInvestmentOpportunities',
                'question' => 'Do you pursue cross-border investment opportunities?',
                'synonyms' => ['do you look for investments in other countries?'],
            ],
            [
                'key' => 'jointVentureOpportunities',
                'question' => 'Do you explore joint venture opportunities?',
                'synonyms' => ['do you look for chances to partner with other companies?'],
            ],
            [
                'key' => 'mergerIntegrationProcess',
                'question' => 'How do you integrate mergers?',
                'synonyms' => ['how do you combine with another company?'],
            ],
            [
                'key' => 'acquisitionSynergiesAchieved',
                'question' => 'Have you achieved synergies from acquisitions?',
                'synonyms' => ['have you seen benefits from buying other companies?'],
            ],
            [
                'key' => 'financialLeverageRatio',
                'question' => 'What is your financial leverage ratio?',
                'synonyms' => ['how much debt do you use to finance your assets?'],
            ],
            [
                'key' => 'debtEquityRatioValue',
                'question' => 'What is your debt-to-equity ratio?',
                'synonyms' => ['how much debt do you have compared to your shareholders\' equity?'],
            ],
            [
                'key' => 'capitalExpenditurePlan',
                'question' => 'Describe your capital expenditure plan.',
                'synonyms' => ['tell us about your plans for spending on assets'],
            ],
            [
                'key' => 'operatingCashFlowDetails',
                'question' => 'What are your operating cash flow details?',
                'synonyms' => ['tell us about the money coming in and out from your main business activities'],
            ],
            [
                'key' => 'freeCashFlowStatus',
                'question' => 'What is your free cash flow status?',
                'synonyms' => ['how much cash do you have after paying for operations and investments?'],
            ],
            [
                'key' => 'dividendPayoutPolicy',
                'question' => 'What is your dividend payout policy?',
                'synonyms' => ['how do you decide how much of your profits to give to shareholders?'],
            ],
            [
                'key' => 'sharePricePerformanceHistory',
                'question' => 'How has your share price performed historically?',
                'synonyms' => ['how has your stock price changed over time?'],
            ],
            [
                'key' => 'investorRelationsStrategy',
                'question' => 'What is your investor relations strategy?',
                'synonyms' => ['how do you communicate with your investors?'],
            ],
            [
                'key' => 'annualGeneralMeetingFrequency',
                'question' => 'How often do you hold an annual general meeting?',
                'synonyms' => ['how often do you have your yearly shareholder meeting?'],
            ],
            [
                'key' => 'shareholderCommunicationMethods',
                'question' => 'How do you communicate with your shareholders?',
                'synonyms' => ['how do you keep your shareholders informed?'],
            ],
            [
                'key' => 'financialTransparencyRating',
                'question' => 'How transparent is your financial reporting?',
                'synonyms' => ['how clear and open is your financial reporting?'],
            ],
            [
                'key' => 'marketVolatilityImpact',
                'question' => 'How does market volatility affect your business?',
                'synonyms' => ['how do ups and downs in the market affect you?'],
            ],
            [
                'key' => 'hedgingStrategiesUsed',
                'question' => 'What hedging strategies do you use?',
                'synonyms' => ['how do you protect yourself from financial risks?'],
            ],
            [
                'key' => 'corporateRebrandingEfforts',
                'question' => 'Have you undergone any corporate rebranding efforts?',
                'synonyms' => ['have you changed your brand\'s image?'],
            ],
            [
                'key' => 'customerSegmentationMethod',
                'question' => 'How do you segment your customers?',
                'synonyms' => ['how do you divide your customers into groups?'],
            ],
            [
                'key' => 'targetedAdvertisingEffectiveness',
                'question' => 'How effective is your targeted advertising?',
                'synonyms' => ['how well does your advertising reach the right people?'],
            ],
            [
                'key' => 'contentDistributionChannels',
                'question' => 'What channels do you use for content distribution?',
                'synonyms' => ['where do you share your content?'],
            ],
            [
                'key' => 'inboundMarketingSuccess',
                'question' => 'How successful is your inbound marketing?',
                'synonyms' => ['how well do you attract customers through your content?'],
            ],
            [
                'key' => 'outboundMarketingStrategies',
                'question' => 'What outbound marketing strategies do you employ?',
                'synonyms' => ['how do you proactively reach out to potential customers?'],
            ],
            [
                'key' => 'salesIncentivesProgram',
                'question' => 'Describe your sales incentives program.',
                'synonyms' => ['tell us about how you motivate your sales team'],
            ],
            [
                'key' => 'marketPositioningStatement',
                'question' => 'What is your market positioning statement?',
                'synonyms' => ['how do you describe your product\'s place in the market?'],
            ],
            [
                'key' => 'competitivePricingStrategy',
                'question' => 'What is your competitive pricing strategy?',
                'synonyms' => ['how do you price your products compared to others?'],
            ],
            [
                'key' => 'distributionChannelsOverview',
                'question' => 'How do you manage your distribution channels?',
                'synonyms' => ['how do you get your products to your customers?'],
            ],
            [
                'key' => 'productBundlingOptions',
                'question' => 'What product bundling options do you offer?',
                'synonyms' => ['what combinations of products do you sell together?'],
            ],
            [
                'key' => 'upsellingTechniques',
                'question' => 'Describe your upselling techniques.',
                'synonyms' => ['tell us how you encourage customers to buy more expensive items'],
            ],
            [
                'key' => 'crossSellingStrategies',
                'question' => 'What cross-selling strategies do you use?',
                'synonyms' => ['how do you encourage customers to buy related items?'],
            ],
            [
                'key' => 'customerWinBackCampaign',
                'question' => 'Do you run customer win-back campaigns?',
                'synonyms' => ['do you try to get old customers to come back?'],
            ],
            [
                'key' => 'brandRevitalizationPlan',
                'question' => 'What is your brand revitalization plan?',
                'synonyms' => ['how do you plan to refresh your brand?'],
            ],
            [
                'key' => 'onlineReputationManagement',
                'question' => 'How do you manage your online reputation?',
                'synonyms' => ['how do you handle what people say about you online?'],
            ],
            [
                'key' => 'crisisManagementPlan',
                'question' => 'Do you have a crisis management plan?',
                'synonyms' => ['do you have a plan for when bad things happen?'],
            ],
            [
                'key' => 'mediaRelationsStrategy',
                'question' => 'What is your media relations strategy?',
                'synonyms' => ['how do you work with the press?'],
            ],
            [
                'key' => 'sponsorshipActivationsDetail',
                'question' => 'Describe your sponsorship activations.',
                'synonyms' => ['tell us about how you use sponsorships'],
            ],
            [
                'key' => 'influencerCampaignResults',
                'question' => 'What results have you seen from influencer campaigns?',
                'synonyms' => ['how well have your campaigns with online personalities worked?'],
            ],
            [
                'key' => 'affiliateSalesProgram',
                'question' => 'Do you have an affiliate sales program?',
                'synonyms' => ['do you pay others to promote your products?'],
            ],
            [
                'key' => 'loyaltyProgramDetails',
                'question' => 'What details can you share about your loyalty program?',
                'synonyms' => ['tell us about your rewards program'],
            ],
            [
                'key' => 'promotionalCampaignOverview',
                'question' => 'Describe your promotional campaigns.',
                'synonyms' => ['tell us about your sales promotions'],
            ],
            [
                'key' => 'seasonalOfferStrategy',
                'question' => 'What seasonal offers do you run?',
                'synonyms' => ['what special deals do you have at different times of the year?'],
            ],
            [
                'key' => 'bulkDiscountStructure',
                'question' => 'What is your bulk discount structure?',
                'synonyms' => ['how much discount do you offer for large orders?'],
            ],
            [
                'key' => 'membershipBenefitsDetail',
                'question' => 'Describe the benefits of membership.',
                'synonyms' => ['what do members get?'],
            ],
            [
                'key' => 'subscriptionOptionsAvailable',
                'question' => 'What subscription options are available?',
                'synonyms' => ['what kinds of subscriptions do you offer?'],
            ],
            [
                'key' => 'renewalReminderProcess',
                'question' => 'How do you handle renewal reminders?',
                'synonyms' => ['how do you remind people to renew their subscriptions?'],
            ],
            [
                'key' => 'upgradeOptionDetails',
                'question' => 'What upgrade options do you offer?',
                'synonyms' => ['how can people get a better version of your product?'],
            ],
            [
                'key' => 'downgradePolicyDetails',
                'question' => 'What is your downgrade policy?',
                'synonyms' => ['what happens if someone wants a cheaper version?'],
            ],
            [
                'key' => 'cancellationFeePolicy',
                'question' => 'Are there any cancellation fees?',
                'synonyms' => ['do you charge if someone cancels?'],
            ],
            [
                'key' => 'refundProcessDetails',
                'question' => 'Describe your refund process.',
                'synonyms' => ['tell us how you handle refunds'],
            ],
            [
                'key' => 'trialConversionRateData',
                'question' => 'What is your trial conversion rate?',
                'synonyms' => ['how many people who try your product for free end up paying?'],
            ],
            [
                'key' => 'userChurnRateData',
                'question' => 'What is your user churn rate?',
                'synonyms' => ['how many users stop using your product over time?'],
            ],
            [
                'key' => 'customerFeedbackAverage',
                'question' => 'What is your average customer feedback score?',
                'synonyms' => ['what\'s the average rating customers give you?'],
            ],
            [
                'key' => 'socialMediaEngagementMetrics',
                'question' => 'How do you measure social media engagement?',
                'synonyms' => ['how do you track how people interact with you on social media?'],
            ],
            [
                'key' => 'websiteTrafficAnalysis',
                'question' => 'Describe your website traffic analysis.',
                'synonyms' => ['tell us how you look at who visits your website'],
            ],
            [
                'key' => 'conversionOptimizationTechniques',
                'question' => 'What techniques do you use for conversion optimization?',
                'synonyms' => ['how do you try to get more website visitors to become customers?'],
            ],
            [
                'key' => 'mobileOptimizationStatus',
                'question' => 'Is your website optimized for mobile?',
                'synonyms' => ['does your website work well on phones?'],
            ],
            [
                'key' => 'userRetentionStrategies',
                'question' => 'What strategies do you use for user retention?',
                'synonyms' => ['how do you keep users coming back?'],
            ],
            [
                'key' => 'appStoreRatingData',
                'question' => 'What are your app store ratings?',
                'synonyms' => ['what scores do people give your app?'],
            ],
            [
                'key' => 'featureUsageStats',
                'question' => 'What are your key feature usage statistics?',
                'synonyms' => ['which parts of your product do people use the most?'],
            ],
            [
                'key' => 'supportSatisfactionData',
                'question' => 'What is your support satisfaction rating?',
                'synonyms' => ['how happy are people with your customer support?'],
            ],
            [
                'key' => 'technicalIssueResolutionTime',
                'question' => 'What is your average technical issue resolution time?',
                'synonyms' => ['how long does it usually take to fix tech problems?'],
            ],
            [
                'key' => 'productReturnRateData',
                'question' => 'What is your product return rate?',
                'synonyms' => ['how often do people send your products back?'],
            ],
            [
                'key' => 'inventoryTurnoverRateData',
                'question' => 'What is your inventory turnover rate?',
                'synonyms' => ['how quickly do you sell and replace your stock?'],
            ],
            [
                'key' => 'profitMarginData',
                'question' => 'What are your profit margins?',
                'synonyms' => ['how much profit do you make on each sale?'],
            ],
            [
                'key' => 'costOfGoodsSoldData',
                'question' => 'What is your cost of goods sold?',
                'synonyms' => ['how much does it cost you to produce what you sell?'],
            ],
            [
                'key' => 'operationalCostData',
                'question' => 'What are your operational costs?',
                'synonyms' => ['how much does it cost to run your business?'],
            ],
            [
                'key' => 'revenueGrowthRateData',
                'question' => 'What is your revenue growth rate?',
                'synonyms' => ['how quickly is your income increasing?'],
            ],
            [
                'key' => 'marketForecastProjection',
                'question' => 'What is your market forecast for the next year?',
                'synonyms' => ['what do you expect the market to be like next year?'],
            ],
            [
                'key' => 'emailConfirmation',
                'question' => 'Confirm your email address.',
                'synonyms' => ['re-enter email', 'verify email'],
            ],
            [
                'key' => 'currentPassword',
                'question' => 'What is your current password?',
                'synonyms' => ['old password'],
            ],
            [
                'key' => 'newPassword',
                'question' => 'Enter a new password.',
                'synonyms' => ['create new password'],
            ],
            [
                'key' => 'securityQuestion1',
                'question' => 'What is your mother\'s maiden name?',
                'synonyms' => ['mother\'s birth name', 'security question one'],
            ],
            [
                'key' => 'securityAnswer1',
                'question' => 'Answer to security question 1.',
                'synonyms' => ['response to security question one'],
            ],
            [
                'key' => 'securityQuestion2',
                'question' => 'What was the name of your first pet?',
                'synonyms' => ['first pet\'s name', 'security question two'],
            ],
            [
                'key' => 'securityAnswer2',
                'question' => 'Answer to security question 2.',
                'synonyms' => ['response to security question two'],
            ],
            [
                'key' => 'age',
                'question' => 'What is your age?',
                'synonyms' => ['how old are you'],
            ],
            [
                'key' => 'weight',
                'question' => 'What is your weight (in kg or lbs)?',
                'synonyms' => ['your weight'],
            ],
            [
                'key' => 'height',
                'question' => 'What is your height (in cm or feet and inches)?',
                'synonyms' => ['your height'],
            ],
            [
                'key' => 'eyeColor',
                'question' => 'What is your eye color?',
                'synonyms' => ['color of your eyes'],
            ],
            [
                'key' => 'hairColor',
                'question' => 'What is your hair color?',
                'synonyms' => ['color of your hair'],
            ],
            [
                'key' => 'bloodType',
                'question' => 'What is your blood type?',
                'synonyms' => ['your blood group'],
            ],
            [
                'key' => 'nationality',
                'question' => 'What is your nationality?',
                'synonyms' => ['citizenship'],
            ],
            [
                'key' => 'mailingListOptIn',
                'question' => 'Would you like to join our mailing list?',
                'synonyms' => ['subscribe to our newsletter', 'opt-in for emails'],
            ],
            [
                'key' => 'termsAndConditions',
                'question' => 'I agree to the terms and conditions.',
                'synonyms' => ['agree to terms', 'accept conditions'],
            ],
            [
                'key' => 'privacyPolicy',
                'question' => 'I have read and agree to the privacy policy.',
                'synonyms' => ['agree to privacy policy', 'accept privacy statement'],
            ],
            [
                'key' => 'captcha',
                'question' => 'Please enter the text shown in the image.',
                'synonyms' => ['captcha verification', 'enter the code'],
            ],
            [
                'key' => 'referralName',
                'question' => 'Who referred you?',
                'synonyms' => ['referrer\'s name'],
            ],
            [
                'key' => 'hearAboutUsOther',
                'question' => 'If other, please specify how you heard about us.',
                'synonyms' => ['other referral source'],
            ],
            [
                'key' => 'productInterest',
                'question' => 'Which products are you interested in?',
                'synonyms' => ['interested products'],
            ],
            [
                'key' => 'serviceInterestMultiple',
                'question' => 'Which services are you interested in?',
                'synonyms' => ['interested services'],
            ],
            [
                'key' => 'preferredCurrency',
                'question' => 'What is your preferred currency?',
                'synonyms' => ['currency preference'],
            ],
            [
                'key' => 'donationAmount',
                'question' => 'How much would you like to donate?',
                'synonyms' => ['donation value'],
            ],
            [
                'key' => 'paymentFrequency',
                'question' => 'How often would you like to make payments?',
                'synonyms' => ['payment schedule'],
            ],
            [
                'key' => 'securityCode',
                'question' => 'Enter the security code.',
                'synonyms' => ['verification code'],
            ],
            [
                'key' => 'transactionId',
                'question' => 'Enter your transaction ID.',
                'synonyms' => ['transaction number'],
            ],
            [
                'key' => 'confirmationNumber',
                'question' => 'Enter your confirmation number.',
                'synonyms' => ['booking reference'],
            ],
            [
                'key' => 'eventId',
                'question' => 'Enter the event ID.',
                'synonyms' => ['event number'],
            ],
            [
                'key' => 'registrationCode',
                'question' => 'Enter your registration code.',
                'synonyms' => ['enrollment key'],
            ],
            [
                'key' => 'surveyCode',
                'question' => 'Enter the survey code.',
                'synonyms' => ['poll code'],
            ],
            [
                'key' => 'ticketNumber',
                'question' => 'Enter your ticket number.',
                'synonyms' => ['support ticket ID'],
            ],
            [
                'key' => 'issueDescription',
                'question' => 'Please describe the issue you are experiencing.',
                'synonyms' => ['problem description', 'details of the issue'],
            ],
            [
                'key' => 'urgencyLevel',
                'question' => 'How urgent is this issue?',
                'synonyms' => ['priority level'],
            ],
            [
                'key' => 'operatingSystem',
                'question' => 'What is your operating system?',
                'synonyms' => ['OS version'],
            ],
            [
                'key' => 'browser',
                'question' => 'Which web browser are you using?',
                'synonyms' => ['browser type'],
            ],
            [
                'key' => 'deviceModel',
                'question' => 'What is your device model?',
                'synonyms' => ['type of device'],
            ],
            [
                'key' => 'appVersion',
                'question' => 'What is the app version?',
                'synonyms' => ['application version'],
            ],
            [
                'key' => 'errorDetails',
                'question' => 'Please provide any error details or messages.',
                'synonyms' => ['error messages'],
            ],
            [
                'key' => 'stepsToReproduce',
                'question' => 'What steps can we take to reproduce the issue?',
                'synonyms' => ['how to recreate the problem'],
            ],
            [
                'key' => 'attachment',
                'question' => 'Please attach any relevant files.',
                'synonyms' => ['upload files'],
            ],
            [
                'key' => 'screenshot',
                'question' => 'Please upload a screenshot of the issue.',
                'synonyms' => ['image of the problem'],
            ],
            [
                'key' => 'videoRecording',
                'question' => 'Please attach a video recording if possible.',
                'synonyms' => ['record of the issue'],
            ],
            [
                'key' => 'preferredResolution',
                'question' => 'What is your preferred resolution?',
                'synonyms' => ['desired outcome'],
            ],
            [
                'key' => 'followUpPreference',
                'question' => 'How would you like us to follow up?',
                'synonyms' => ['preferred contact method for follow-up'],
            ],
            [
                'key' => 'caseNumber',
                'question' => 'Enter your case number.',
                'synonyms' => ['support ID'],
            ],
            [
                'key' => 'previousTickets',
                'question' => 'Have you submitted any previous tickets regarding this issue?',
                'synonyms' => ['related support requests'],
            ],
            [
                'key' => 'satisfactionReason',
                'question' => 'Please tell us why you gave this satisfaction rating.',
                'synonyms' => ['reason for your rating'],
            ],
            [
                'key' => 'npsScore',
                'question' => 'On a scale of 0 to 10, how likely are you to recommend us?',
                'synonyms' => ['net promoter score'],
            ],
            [
                'key' => 'detractorReason',
                'question' => 'What could we do to improve your experience?',
                'synonyms' => ['suggestions for improvement'],
            ],
            [
                'key' => 'promoterReason',
                'question' => 'What did you like most about your experience?',
                'synonyms' => ['positive feedback'],
            ],
            [
                'key' => 'neutralReason',
                'question' => 'How could we make your experience a 10?',
                'synonyms' => ['areas for improvement'],
            ],
            [
                'key' => 'featureRequest',
                'question' => 'What features would you like to see in the future?',
                'synonyms' => ['suggested features'],
            ],
            [
                'key' => 'usabilityFeedback',
                'question' => 'Do you have any feedback on the usability of our product?',
                'synonyms' => ['ease of use feedback'],
            ],
            [
                'key' => 'designFeedback',
                'question' => 'What are your thoughts on the design?',
                'synonyms' => ['feedback on the aesthetics'],
            ],
            [
                'key' => 'performanceFeedback',
                'question' => 'How would you rate the performance?',
                'synonyms' => ['feedback on speed and reliability'],
            ],
            [
                'key' => 'contentFeedback',
                'question' => 'Do you have any feedback on the content?',
                'synonyms' => ['comments on the information provided'],
            ],
            [
                'key' => 'pricingFeedback',
                'question' => 'What are your thoughts on our pricing?',
                'synonyms' => ['feedback on the cost'],
            ],
            [
                'key' => 'onboardingFeedback',
                'question' => 'What was your experience with the onboarding process?',
                'synonyms' => ['feedback on getting started'],
            ],
            [
                'key' => 'offboardingFeedback',
                'question' => 'What was your experience with the offboarding process?',
                'synonyms' => ['feedback on leaving the service'],
            ],
            [
                'key' => 'eventAttendance',
                'question' => 'Will you be attending this event?',
                'synonyms' => ['are you going to the event?'],
            ],
            [
                'key' => 'sessionPreference',
                'question' => 'Which session would you like to attend?',
                'synonyms' => ['preferred sessions'],
            ],
            [
                'key' => 'dietaryRestrictionsEvent',
                'question' => 'Do you have any dietary restrictions for the event?',
                'synonyms' => ['food restrictions for the event'],
            ],
            [
                'key' => 'accommodationNeeds',
                'question' => 'Do you have any accommodation needs?',
                'synonyms' => ['lodging requirements'],
            ],
            [
                'key' => 'transportationNeeds',
                'question' => 'Do you require transportation assistance?',
                'synonyms' => ['travel arrangements'],
            ],
            [
                'key' => 'membershipType',
                'question' => 'What type of membership are you interested in?',
                'synonyms' => ['membership options'],
            ],
            [
                'key' => 'subscriptionDuration',
                'question' => 'How long would you like your subscription to be?',
                'synonyms' => ['subscription length'],
            ],
            [
                'key' => 'licenseType',
                'question' => 'What type of license do you need?',
                'synonyms' => ['license options'],
            ],
            [
                'key' => 'numberOfUsers',
                'question' => 'How many users will need access?',
                'synonyms' => ['user count'],
            ],
            [
                'key' => 'fileUpload',
                'question' => 'Please upload your file.',
                'synonyms' => ['upload document'],
            ],
            [
                'key' => 'imageUpload',
                'question' => 'Please upload an image.',
                'synonyms' => ['upload picture'],
            ],
            [
                'key' => 'videoUpload',
                'question' => 'Please upload your video.',
                'synonyms' => ['upload movie'],
            ],
            [
                'key' => 'documentType',
                'question' => 'What type of document are you uploading?',
                'synonyms' => ['file format'],
            ],
            [
                'key' => 'signature',
                'question' => 'Please provide your signature.',
                'synonyms' => ['sign here'],
            ],
            [
                'key' => 'confirmationCheckbox',
                'question' => 'Please check the box to confirm.',
                'synonyms' => ['tick to confirm'],
            ],
            [
                'key' => 'ratingScale',
                'question' => 'Please rate on a scale of 1 to 10.',
                'synonyms' => ['give a rating'],
            ],
            [
                'key' => 'multipleChoice',
                'question' => 'Please select one or more options.',
                'synonyms' => ['choose from the list'],
            ],
            [
                'key' => 'dropdownSelect',
                'question' => 'Please select an option from the dropdown.',
                'synonyms' => ['choose from the menu'],
            ],
            [
                'key' => 'yesNoAnswer',
                'question' => 'Please answer yes or no.',
                'synonyms' => ['boolean response'],
            ],
            [
                'key' => 'dateSelection',
                'question' => 'Please select a date.',
                'synonyms' => ['choose a date'],
            ],
            [
                'key' => 'timeSelection',
                'question' => 'Please select a time.',
                'synonyms' => ['choose a time'],
            ],
            [
                'key' => 'location',
                'question' => 'What is your location?',
                'synonyms' => ['where are you located?'],
            ],
            [
                'key' => 'countryCode',
                'question' => 'Enter your country code.',
                'synonyms' => ['phone prefix'],
            ],
            [
                'key' => 'areaCode',
                'question' => 'Enter your area code.',
                'synonyms' => ['region code'],
            ],
            [
                'key' => 'phoneNumberDigits',
                'question' => 'Enter the remaining digits of your phone number.',
                'synonyms' => ['phone number part'],
            ],
            [
                'key' => 'creditCardType',
                'question' => 'Select your credit card type.',
                'synonyms' => ['card brand'],
            ],
            [
                'key' => 'nameOnCard',
                'question' => 'Name on the card.',
                'synonyms' => ['cardholder name'],
            ],
            [
                'key' => 'securityQuestion3',
                'question' => 'What is the city of your birth?',
                'synonyms' => ['birth city', 'security question three'],
            ],
            [
                'key' => 'securityAnswer3',
                'question' => 'Answer to security question 3.',
                'synonyms' => ['response to security question three'],
            ],
            [
                'key' => 'timeOfDayPreference',
                'question' => 'What time of day do you prefer?',
                'synonyms' => ['preferred time'],
            ],
            [
                'key' => 'communicationFrequency',
                'question' => 'How often would you like to hear from us?',
                'synonyms' => ['contact frequency'],
            ],
            [
                'key' => 'relationshipToApplicant',
                'question' => 'What is your relationship to the applicant?',
                'synonyms' => ['your relation to this person'],
            ],
            [
                'key' => 'referencePhoneNumber',
                'question' => 'Reference\'s phone number.',
                'synonyms' => ['recommender\'s phone'],
            ],
            [
                'key' => 'referenceEmail',
                'question' => 'Reference\'s email address.',
                'synonyms' => ['recommender\'s email'],
            ],
            [
                'key' => 'jobType',
                'question' => 'What type of job are you looking for?',
                'synonyms' => ['desired job category'],
            ],
            [
                'key' => 'salaryExpectation',
                'question' => 'What is your salary expectation?',
                'synonyms' => ['desired salary'],
            ],
            [
                'key' => 'availabilityDate',
                'question' => 'When are you available to start?',
                'synonyms' => ['start date'],
            ],
            [
                'key' => 'reasonForLeaving',
                'question' => 'What is your reason for leaving your previous role?',
                'synonyms' => ['why did you leave your last job?'],
            ],
            [
                'key' => 'noticePeriod',
                'question' => 'What is your notice period?',
                'synonyms' => ['how much notice do you need to give?'],
            ],
            [
                'key' => 'visaStatus',
                'question' => 'What is your current visa status?',
                'synonyms' => ['immigration status'],
            ],
            [
                'key' => 'employmentType',
                'question' => 'What type of employment are you seeking?',
                'synonyms' => ['desired work arrangement'],
            ],
            [
                'key' => 'remoteWorkPreference',
                'question' => 'Do you prefer remote work?',
                'synonyms' => ['preference for working from home'],
            ],
            [
                'key' => 'coverLetter',
                'question' => 'Please upload your cover letter.',
                'synonyms' => ['letter of introduction'],
            ],
            [
                'key' => 'resume',
                'question' => 'Please upload your resume/CV.',
                'synonyms' => ['curriculum vitae'],
            ],
            [
                'key' => 'username',
                'question' => 'What is your username for this site, or what would you like your username to be?',
                'synonyms' => ['user name', 'login name', 'account name'],
            ],
        ];
        
        foreach ($questionMappings as $mapping) {
            QuestionMapping::updateOrCreate(
                ['key' => $mapping['key']],
                $mapping
            );
            $this->command->info('Seeded mapping with key: ' . $mapping['key']);
        }

        $this->command->info('Seeded all question mappings successfully.');
    }
}

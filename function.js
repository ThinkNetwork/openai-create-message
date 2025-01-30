window.function = async function(api_key, thread_id, role, content, attachments, metadata) {
    // Validate API Key
    if (!api_key.value) {
        return "Error: OpenAI API Key is required.";
    }

    // Validate Thread ID
    if (!thread_id.value) {
        return "Error: Thread ID is required.";
    }

    // Validate Role
    if (!role.value) {
        return "Error: Role (user or assistant) is required.";
    }

    // Validate Content
    if (!content.value) {
        return "Error: Message content is required.";
    }

    // Parse attachments if provided
    let attachmentsValue = undefined;
    if (attachments.value) {
        try {
            attachmentsValue = JSON.parse(attachments.value);
            if (!Array.isArray(attachmentsValue)) {
                return "Error: Attachments should be an array of objects.";
            }
        } catch (e) {
            return "Error: Invalid JSON format for attachments.";
        }
    }

    // Parse metadata if provided
    let metadataValue = undefined;
    if (metadata.value) {
        try {
            metadataValue = JSON.parse(metadata.value);
        } catch (e) {
            return "Error: Invalid JSON format for metadata.";
        }
    }

    // Construct request payload
    const payload = {
        role: role.value,
        content: content.value
    };
    if (attachmentsValue) payload.attachments = attachmentsValue;
    if (metadataValue) payload.metadata = metadataValue;

    // API endpoint URL
    const apiUrl = `https://api.openai.com/v1/threads/${thread_id.value}/messages`;

    // Make API request
    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${api_key.value}`,
                "OpenAI-Beta": "assistants=v2"
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json();
            return `Error ${response.status}: ${errorData.error?.message || "Unknown error"}`;
        }

        // Parse and return the response
        const responseData = await response.json();
        return JSON.stringify(responseData, null, 2);

    } catch (error) {
        return `Error: Request failed - ${error.message}`;
    }
};

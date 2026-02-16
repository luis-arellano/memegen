#!/bin/bash

# Ralph Wiggum Loop for Memegen Project
# This script runs Claude Code in a continuous loop, feeding it the PROMPT.md file
# until the task is complete or max iterations is reached.

# Configuration
MAX_ITERATIONS=${MAX_ITERATIONS:-50}  # Default to 50, override with env var
PROMPT_FILE="PROMPT.md"
ITERATION=0

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Ralph Wiggum Loop - Memegen Project${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "Max iterations: ${MAX_ITERATIONS}"
echo -e "Prompt file: ${PROMPT_FILE}"
echo ""

# Check if PROMPT.md exists
if [ ! -f "$PROMPT_FILE" ]; then
    echo -e "${RED}Error: $PROMPT_FILE not found!${NC}"
    echo "Please create a PROMPT.md file with your task description."
    exit 1
fi

# Show initial story count if plan.md exists
if [ -f "plan.md" ]; then
    TOTAL_STORIES=$(grep -c '"passes":' plan.md 2>/dev/null || echo "0")
    INCOMPLETE_STORIES=$(grep -c '"passes": false' plan.md 2>/dev/null || echo "0")
    echo -e "Plan found: ${TOTAL_STORIES} total stories, ${INCOMPLETE_STORIES} incomplete"
    echo ""
fi

echo -e "${YELLOW}Starting Ralph Loop...${NC}"
echo ""

# Main loop
while [ $ITERATION -lt $MAX_ITERATIONS ]; do
    ITERATION=$((ITERATION + 1))

    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}Iteration $ITERATION / $MAX_ITERATIONS${NC}"
    echo -e "${GREEN}========================================${NC}"

    # Run claude with the prompt, capture output AND display it in real-time
    result=$(cat "$PROMPT_FILE" | claude --dangerously-skip-permissions 2>&1 | tee /dev/tty)
    EXIT_CODE=$?

    echo ""  # Add spacing after output

    # Check for completion markers
    if [[ "$result" == *"<promise>COMPLETE</promise>"* ]]; then
        echo -e "${GREEN}✓✓✓ Task marked COMPLETE after $ITERATION iterations${NC}"
        exit 0
    fi

    # Check if all stories in plan.md have passes: true
    if [ -f "plan.md" ]; then
        if ! grep -q '"passes": false' plan.md; then
            echo -e "${GREEN}✓✓✓ All stories in plan.md pass! Task complete after $ITERATION iterations${NC}"
            exit 0
        else
            # Count remaining stories
            REMAINING=$(grep -c '"passes": false' plan.md)
            echo -e "${YELLOW}📋 Stories remaining: $REMAINING${NC}"
        fi
    fi

    # Report iteration status
    if [ $EXIT_CODE -eq 0 ]; then
        echo -e "${GREEN}✓ Iteration $ITERATION completed successfully${NC}"
    else
        echo -e "${RED}✗ Iteration $ITERATION failed with exit code $EXIT_CODE${NC}"
        echo -e "${YELLOW}Continuing to next iteration...${NC}"
    fi

    # Small delay between iterations to avoid rate limits
    sleep 3

    echo ""
done

echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}Ralph Loop completed after $ITERATION iterations${NC}"
echo -e "${YELLOW}========================================${NC}"

# Check final status
if [ -f "plan.md" ]; then
    REMAINING=$(grep -c '"passes": false' plan.md 2>/dev/null || echo "0")
    if [ "$REMAINING" -eq 0 ]; then
        echo -e "${GREEN}✓ All stories completed!${NC}"
    else
        echo -e "${YELLOW}⚠ $REMAINING stories still pending${NC}"
        echo -e "Tip: Review plan.md and continue with more iterations if needed"
    fi
fi

# Check if progress file exists
if [ -f "claude-progress.txt" ]; then
    echo -e "\n${GREEN}Progress log available: claude-progress.txt${NC}"
fi

#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("8gKpQKbWvjkbfHY1Gb62LGyuYd6sTNVH484gWm2zhCUt");

#[program]
pub mod maxvotingdapp {
    use super::*;

    pub fn intialize_poll(
        context: Context<InitializePoll>,
        poll_id: u64,
        poll_start: u64,
        poll_end: u64,
        description: String,
    ) -> Result<()> {
        let poll = &mut context.accounts.poll;
        poll.poll_id = poll_id;
        poll.poll_start = poll_start;
        poll.poll_end = poll_end;
        poll.description = description;
        poll.candidate_amount = 0;

        Ok(())
    }

    pub fn initialize_candidate(
        context: Context<InitializeCandidate>,
        candidate_name: String,
        _poll_id: u64,
    ) -> Result<()> {
        let candidate = &mut context.accounts.candidate;
        candidate.candidate_name = candidate_name;
        candidate.candidate_vote = 0;

        let poll = &mut context.accounts.poll;
        poll.candidate_amount += 1;

        Ok(())
    }

    pub fn vote(context: Context<Vote>, _candidate_name: String, _poll_id: u64) -> Result<()> {
        let candidate = &mut context.accounts.candidate;
        candidate.candidate_vote += 1;
        msg!("Voted for candidate: {}", candidate.candidate_name);
        msg!("Candidate votes: {}", candidate.candidate_vote);
        Ok(())
    }
}

#[derive(Accounts)] // Declare the accounts used in the program
#[instruction(candidate_name: String, poll_id: u64)]
pub struct Vote<'info> {
    pub signer: Signer<'info>,

    #[account(
      seeds = [poll_id.to_le_bytes().as_ref()],
      bump
    )]
    pub poll: Account<'info, Poll>,

    #[account(
      mut, // make 
      seeds = [poll_id.to_le_bytes().as_ref(), candidate_name.as_bytes()],
      bump
    )]
    pub candidate: Account<'info, Candidate>,
}

#[derive(Accounts)] // Declare the accounts used in the program
#[instruction(poll_id: u64)]
pub struct InitializePoll<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(
      init,
      payer = signer,
      space = 8 + Poll::INIT_SPACE,
      seeds = [poll_id.to_le_bytes().as_ref()],
      bump
    )]
    pub poll: Account<'info, Poll>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)] // Declare the accounts used in the program
#[instruction(candidate_name: String, poll_id: u64)]
pub struct InitializeCandidate<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
      seeds = [poll_id.to_le_bytes().as_ref()],
      bump
    )]
    pub poll: Account<'info, Poll>,

    #[account(
      init,
      payer = signer,
      space = 8 + Candidate::INIT_SPACE,
      seeds = [poll_id.to_le_bytes().as_ref(), candidate_name.as_bytes()],
      bump
    )]
    pub candidate: Account<'info, Candidate>,

    pub system_program: Program<'info, System>,
}

#[account] // Declare the Poll account
#[derive(InitSpace)]
pub struct Poll {
    pub poll_id: u64,
    #[max_len(280)]
    pub description: String,
    pub candidate_amount: u64,
    pub poll_start: u64,
    pub poll_end: u64,
}

#[account] // Declare the Poll account
#[derive(InitSpace)]
pub struct Candidate {
    #[max_len(32)]
    pub candidate_name: String,
    pub candidate_vote: u64,
}

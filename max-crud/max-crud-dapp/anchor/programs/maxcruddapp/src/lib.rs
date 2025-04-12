#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("8gKpQKbWvjkbfHY1Gb62LGyuYd6sTNVH484gWm2zhCUt");

#[program]
pub mod maxcruddapp {
    use super::*;

    pub fn create_journal_entry(context: Context<CreateEntry>, title: String, message: String) -> Result<()> {
        let journal_entry = &mut context.accounts.journal_entry;
        journal_entry.owner = *context.accounts.owner.key;
        journal_entry.title = title;
        journal_entry.message = message;
        Ok(())
    }

    pub fn update_journal_entry(context: Context<UpdateEntry>, _title: String, message: String) -> Result<()> {
        let journal_entry = &mut context.accounts.journal_entry;
        journal_entry.message = message;
        Ok(())
    }

    pub fn delete_journal_entry(_context: Context<DeleteEntry>, _title: String) -> Result<()> {
        // This function will automatically close the account and return the rent to the owner
        // thanks to the `close = owner` constraint in the DeleteEntry struct
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(title: String)]
pub struct CreateEntry<'info> { // the instruction struct
    #[account(mut)]
    pub owner: Signer<'info>,

    #[account(
        init,  // init if the account does not exist
        payer = owner, // owner pays for the account
        seeds = [title.as_bytes(), owner.key().as_ref()], // seeds for the account address derivation 
        space = 8 + JournalEntryState::INIT_SPACE, // space for the account data
        bump,
    )]
    pub journal_entry: Account<'info, JournalEntryState>, // the account to create

    pub system_program: Program<'info, System>, // the system program
}

#[derive(Accounts)]
#[instruction(title: String)]
pub struct UpdateEntry<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,

    #[account(
        mut,
        seeds = [title.as_bytes(), owner.key().as_ref()],
        bump,
        has_one = owner @ ErrorCode::Unauthorized,
        realloc = 8 + JournalEntryState::INIT_SPACE, // reallocating space for the account data
        realloc::payer = owner, // owner pays for the reallocation
        realloc::zero = true,   // zeroing the account data ( zeroing is required for reallocating space )
    )]
    pub journal_entry: Account<'info, JournalEntryState>, // the account to update

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(title: String)]
pub struct DeleteEntry<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,

    #[account(
        mut, 
        seeds = [title.as_bytes(), owner.key().as_ref()],
        bump,
        has_one = owner @ ErrorCode::Unauthorized,
        close = owner,
    )]
    pub journal_entry: Account<'info, JournalEntryState>,

    pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct JournalEntryState {
    pub owner: Pubkey,
    #[max_len(50)]
    pub title: String,
    #[max_len(1000)]
    pub message: String,
}

#[error_code]
pub enum ErrorCode {
    #[msg("You are not authorized to perform this action")]
    Unauthorized,
}
import React, { useState, useEffect } from "react";
import {
	Card,
	CardContent,
	Typography,
	List,
	ListItem,
	ListItemText,
	Divider,
	Chip,
	LinearProgress,
	Grid,
	Box,
	Button, Dialog, DialogTitle, DialogContent, DialogActions
} from "@mui/material";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faStar as solidStar,
	faCodeBranch as codeFork,
	faCodeCommit as codeCommit,
	faChartBar as chartBar,
} from "@fortawesome/free-solid-svg-icons";
import SemiCircularProgress from "../ProgressBar/SemiCircularProgress";

const Metrics = ({ metric }) => {
	const [animationComplete, setAnimationComplete] = useState(false);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [selectedContent, setSelectedContent] = useState('');
	const [selectedTitle, setSelectedTitle] = useState('');

	const handleMoreClick = (content, title) => {
		setSelectedContent(content);
		setSelectedTitle(title);
		setDialogOpen(true);
	};

	const handleCloseDialog = () => {
		setDialogOpen(false);
	};

	useEffect(() => {
		// Trigger animation when the component is mounted
		setAnimationComplete(true);
	}, []);

	if (!metric || typeof metric !== "object" || !metric.project_descriptions) {
		return (
			<Card>
				<CardContent>
					<Typography component={'span'} variant="body1">No metrics available</Typography>
				</CardContent>
			</Card>
		);
	}

	const CustomLinearProgress = ({ value }) => (
		<Box display="flex" alignItems="center">
			<Box width="100%" mr={1}>
				<LinearProgress
					variant="determinate"
					value={animationComplete ? value : 0}
					sx={{ borderRadius: 5, height: 16 }}
				/>
			</Box>
			<Box minWidth={35}>
				<Typography component={'span'} variant="body2" color="textSecondary">{`${animationComplete ? value.toFixed(0) : 0
					}%`}</Typography>
			</Box>
		</Box>
	);

	const DescriptionBox = ({ children, title }) => (
		<Box
			sx={{
				backgroundColor: "rgba(255, 255, 255, 0.10)",
				padding: "10px",
				borderRadius: "5px",
				marginTop: "8px",
				height: '140px'
			}}
		>
			{children.length > 300 ? (
				<span>
					{children.slice(0, 300)}...
					<span style={{ color: '#0065C1', cursor: 'pointer', textDecoration: 'none' }} onClick={() => handleMoreClick(children, title)}>
						more
					</span>
				</span>
			) : (
				children
			)}
		</Box>
	);

	return (
		<Card
			variant="outlined"
			style={{
				borderRadius: "0 10px 10px 10px",
				border: "5px solid rgba(255, 255, 255, 0.10)",
			}}>
			<CardContent>
				{/* <Typography component={'span'} variant="h5" sx={{ fontFamily: 'Roboto, sans-serif' }}>
          Metrics Overview
        </Typography> */}
				<Grid container>
					{/* Languages */}
					<Grid item xs={12}>
						<List>
							<ListItem>
								<ListItemText
									// primary={<Typography component={'span'} variant="body1" sx={{ fontFamily: 'Roboto, sans-serif' }}>Languages</Typography>}
									secondary={
										<div>
											{Object.keys(metric.languages_used).map((language) => (
												<Chip
													key={language}
													label={language}
													style={{ margin: "2px" }}
												/>
											))}
										</div>
									}
								/>
							</ListItem>
						</List>
					</Grid>
					{/* Left Subgrid for Stars, Forks, Code Rate, and Commit Rate */}
					<Grid container item xs={6}>
						<Grid item xs={6}>
							<List>
								<ListItem>
									<ListItemText
										primary={
											<Typography component={'span'}
												variant="body1"
												sx={{ fontFamily: "Roboto, sans-serif" }}>
												Stars
											</Typography>
										}
										secondary={
											<>
												<FontAwesomeIcon
													icon={solidStar}
													style={{ color: "#ebd005", marginRight: "8px" }}
												/>
												{metric.stars}
											</>
										}
									/>
								</ListItem>
							</List>
						</Grid>
						<Grid item xs={6}>
							<List>
								<ListItem>
									<ListItemText
										primary={
											<Typography component={'span'}
												variant="body1"
												sx={{ fontFamily: "Roboto, sans-serif" }}>
												Forks
											</Typography>
										}
										secondary={
											<>
												<FontAwesomeIcon
													icon={codeFork}
													style={{ color: "#16e6e9", marginRight: "8px" }}
												/>
												{metric.forks}
											</>
										}
									/>
								</ListItem>
							</List>
						</Grid>
						<Grid item xs={6}>
							<List>
								<ListItem>
									<ListItemText
										primary={
											<Typography component={'span'}
												variant="body1"
												sx={{ fontFamily: "Roboto, sans-serif" }}>
												Code Rate
											</Typography>
										}
										secondary={
											<>
												<FontAwesomeIcon
													icon={chartBar}
													rotation={270}
													style={{ color: "#e91c1c", marginRight: "8px" }}
												/>
												{metric.code_rate.toFixed(2)}
												<Chip
													label="bytes/week"
													style={{ marginLeft: "8px" }}
												/>
											</>
										}
									/>
								</ListItem>
							</List>
						</Grid>
						<Grid item xs={6}>
							<List>
								<ListItem>
									<ListItemText
										primary={
											<Typography component={'span'}
												variant="body1"
												sx={{ fontFamily: "Roboto, sans-serif" }}>
												Commit Rate
											</Typography>
										}
										secondary={
											<>
												<FontAwesomeIcon
													icon={codeCommit}
													style={{ color: "#1af50a", marginRight: "8px" }}
												/>
												{metric.commit_rate.toFixed(2)}
												<Chip
													label="commits/week"
													style={{ marginLeft: "8px" }}
												/>
											</>
										}
									/>
								</ListItem>
							</List>
						</Grid>
					</Grid>
					{/* Right Subgrid for Code Quality Score and Percent Contribution */}
					<Grid container item xs={6}>
						{/* Code Quality Score */}
						<Grid item xs={6}>
							<List>
								<ListItem>
									<ListItemText style={{ textAlign: "center" }}
										primary={
											<Typography component={'span'} variant="body1" sx={{ fontFamily: "Roboto, sans-serif" }}>
												Code Quality Score
											</Typography>
										}
										secondary={<SemiCircularProgress color="green" percentage={metric.code_quality_score} />}
									/>
								</ListItem>
							</List>
						</Grid>

						{/* Percent Contribution */}
						<Grid item xs={6}>
							<List>
								<ListItem>
									<ListItemText style={{ textAlign: "center" }}
										primary={
											<Typography component={'span'} variant="body1" sx={{ fontFamily: "Roboto, sans-serif" }}>
												Percent Contribution
											</Typography>
										}
										secondary={<SemiCircularProgress color="green" percentage={metric.percent_contribution} />}
									/>
								</ListItem>
							</List>
						</Grid>
					</Grid>
				</Grid>
				<Divider />
				<Grid container spacing={2}>
					{/* Left column */}
					<Grid item xs={6}>
						<List>
							<ListItem>
								<ListItemText
									primary={
										<Typography component={'span'} variant="body1" sx={{ fontFamily: "Roboto, sans-serif" }}>
											Project Description
										</Typography>
									}
									secondary={<DescriptionBox title="Project Description">{metric.project_descriptions}</DescriptionBox>}
								/>
							</ListItem>
							<ListItem>
								<ListItemText
									primary={
										<Typography component={"span"} variant="body1" sx={{ fontFamily: "Roboto, sans-serif" }}>
											Readme File
										</Typography>
									}
									secondary={<DescriptionBox title="Readme File">{metric.readme_file_quality}</DescriptionBox>}
								/>
							</ListItem>
							<ListItem>
								<ListItemText
									primary={
										<Typography component={"span"} variant="body1" sx={{ fontFamily: "Roboto, sans-serif" }}>
											Coding Style
										</Typography>
									}
									secondary={<DescriptionBox title="Coding Style">{metric.code_quality_style}</DescriptionBox>}
								/>
							</ListItem>
						</List>
					</Grid>

					{/* Right column */}
					<Grid item xs={6}>
						<List>
							<ListItem>
								<ListItemText
									primary={
										<Typography component={"span"} variant="body1" sx={{ fontFamily: "Roboto, sans-serif" }}>
											Directory Structure
										</Typography>
									}
									secondary={<DescriptionBox title="Directory Structure">{metric.directory_structure}</DescriptionBox>}
								/>
							</ListItem>
							<ListItem>
								<ListItemText
									primary={
										<Typography component={"span"} variant="body1" sx={{ fontFamily: "Roboto, sans-serif" }}>
											Commit Names
										</Typography>
									}
									secondary={<DescriptionBox title="Commit Names">{metric.commit_names}</DescriptionBox>}
								/>
							</ListItem>
							<ListItem>
								<ListItemText
									primary={
										<Typography component={"span"} variant="body1" sx={{ fontFamily: "Roboto, sans-serif" }}>
											Branches
										</Typography>
									}
									secondary={<DescriptionBox title="Branches">{metric.branches}</DescriptionBox>}
								/>
							</ListItem>
						</List>
					</Grid>
				</Grid>
				<Dialog open={dialogOpen} onClose={handleCloseDialog}>
					<DialogTitle>{selectedTitle}</DialogTitle>
					<Divider />
					<DialogContent>
						{selectedContent}
					</DialogContent>
					<DialogActions>
						<Button onClick={handleCloseDialog} color="primary">
							Close
						</Button>
					</DialogActions>
				</Dialog>
			</CardContent>
		</Card>
	);
};

export default Metrics;
